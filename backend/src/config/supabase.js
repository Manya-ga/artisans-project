const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const BCRYPT_ROUNDS = 10;

const dbPath = path.resolve(__dirname, '../../local_db.json');

// Initialize database with default empty structure
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialDb = {
        users: [],
        profiles: [],
        products: [],
        stories: [],
        carts: [],
        orders: [],
        messages: [],
        ads: [],
        coupons: [],
        offers: []
      };
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error('Error reading local_db.json:', err);
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to local_db.json:', err);
  }
}

// Simple parsing functions for the OR filter
function parseOrFilter(expr) {
  const results = [];
  let i = 0;
  while (i < expr.length) {
    if (expr.substring(i).startsWith('and(')) {
      let depth = 1;
      let start = i + 4;
      let j = start;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '(') depth++;
        else if (expr[j] === ')') depth--;
        j++;
      }
      const inside = expr.substring(start, j - 1);
      results.push({ type: 'and', clauses: parseClauses(inside) });
      i = j;
      if (expr[i] === ',') i++;
    } else {
      let nextComma = expr.indexOf(',', i);
      if (nextComma === -1) nextComma = expr.length;
      const clauseStr = expr.substring(i, nextComma);
      results.push({ type: 'simple', clause: parseSingleClause(clauseStr) });
      i = nextComma + 1;
    }
  }
  return results;
}

function parseClauses(str) {
  return str.split(',').map(parseSingleClause);
}

function parseSingleClause(str) {
  const parts = str.split('.');
  if (parts.length >= 3) {
    const col = parts[0];
    const op = parts[1];
    const val = parts.slice(2).join('.');
    return { col, op, val };
  }
  return null;
}

function evalOrResults(row, parsedOr) {
  for (const group of parsedOr) {
    if (group.type === 'and') {
      let andMatch = true;
      for (const clause of group.clauses) {
        if (!clause) continue;
        if (!matchClause(row, clause)) {
          andMatch = false;
          break;
        }
      }
      if (andMatch) return true;
    } else if (group.type === 'simple') {
      if (group.clause && matchClause(row, group.clause)) {
        return true;
      }
    }
  }
  return false;
}

function matchClause(row, clause) {
  const rowVal = String(row[clause.col] ?? '').toLowerCase();
  const filterVal = String(clause.val ?? '').replace(/%/g, '').toLowerCase();
  if (clause.op === 'eq') {
    return rowVal === filterVal;
  }
  if (clause.op === 'neq') {
    return rowVal !== filterVal;
  }
  if (clause.op === 'ilike') {
    return rowVal.includes(filterVal);
  }
  return false;
}

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderCol = null;
    this.orderAsc = true;
    this.limitVal = null;
    this.skipVal = null;
    this.isSingle = false;
    this.isMaybeSingle = false;
    this.insertData = null;
    this.updateData = null;
    this.upsertData = null;
    this.deleteAction = false;
    this.selectColumns = '*';
    this.countMode = null;
    this.head = false;
    this.distinctCols = null;
  }

  select(columns, options = {}) {
    this.selectColumns = columns || '*';
    if (options.count) {
      this.countMode = options.count;
    }
    if (options.head) {
      this.head = true;
    }
    return this;
  }

  insert(data) {
    this.insertData = data;
    return this;
  }

  update(data) {
    this.updateData = data;
    return this;
  }

  upsert(data) {
    this.upsertData = data;
    return this;
  }

  delete() {
    this.deleteAction = true;
    return this;
  }

  eq(col, val) {
    this.filters.push({ type: 'eq', col, val });
    return this;
  }

  neq(col, val) {
    this.filters.push({ type: 'neq', col, val });
    return this;
  }

  gte(col, val) {
    this.filters.push({ type: 'gte', col, val });
    return this;
  }

  lte(col, val) {
    this.filters.push({ type: 'lte', col, val });
    return this;
  }

  in(col, val) {
    this.filters.push({ type: 'in', col, val });
    return this;
  }

  or(expr) {
    this.filters.push({ type: 'or', val: expr });
    return this;
  }

  order(col, { ascending = true } = {}) {
    this.orderCol = col;
    this.orderAsc = ascending;
    return this;
  }

  distinct(columns) {
    this.distinctCols = columns;
    return this;
  }

  limit(num) {
    this.limitVal = num;
    return this;
  }

  skip(num) {
    this.skipVal = num;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async then(onfulfilled, onrejected) {
    try {
      const res = await this.execute();
      return onfulfilled ? onfulfilled(res) : res;
    } catch (err) {
      const errorRes = { data: null, count: 0, error: err };
      return onfulfilled ? onfulfilled(errorRes) : errorRes;
    }
  }

  async execute() {
    const db = readDb();
    let rows = db[this.table] || [];

    // 1. Handle Insert
    if (this.insertData) {
      const dataToInsert = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted = dataToInsert.map(item => {
        const newItem = {
          id: item.id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item
        };
        if (this.table === 'profiles') {
          newItem.wishlist = newItem.wishlist || [];
          newItem.followers = newItem.followers || [];
          newItem.following = newItem.following || [];
        }
        rows.push(newItem);
        return newItem;
      });
      db[this.table] = rows;
      writeDb(db);

      const result = Array.isArray(this.insertData) ? inserted : inserted[0];
      return { data: result, count: inserted.length, error: null };
    }

    // 2. Handle Upsert
    if (this.upsertData) {
      const dataToUpsert = Array.isArray(this.upsertData) ? this.upsertData : [this.upsertData];
      const upserted = dataToUpsert.map(item => {
        const existingIdx = rows.findIndex(row => row.id === item.id);
        if (existingIdx > -1) {
          const updatedRow = {
            ...rows[existingIdx],
            ...item,
            updated_at: new Date().toISOString()
          };
          rows[existingIdx] = updatedRow;
          return updatedRow;
        } else {
          const newItem = {
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...item
          };
          if (this.table === 'profiles') {
            newItem.wishlist = newItem.wishlist || [];
            newItem.followers = newItem.followers || [];
            newItem.following = newItem.following || [];
          }
          rows.push(newItem);
          return newItem;
        }
      });
      db[this.table] = rows;
      writeDb(db);

      const result = Array.isArray(this.upsertData) ? upserted : upserted[0];
      return { data: result, count: upserted.length, error: null };
    }

    // 3. Handle Update
    if (this.updateData) {
      const updated = [];
      const updatedRows = rows.map(row => {
        if (this.matchFilters(row)) {
          const newRow = {
            ...row,
            ...this.updateData,
            updated_at: new Date().toISOString()
          };
          updated.push(newRow);
          return newRow;
        }
        return row;
      });
      db[this.table] = updatedRows;
      writeDb(db);

      const result = this.isSingle || this.isMaybeSingle ? updated[0] || null : updated;
      return { data: result, count: updated.length, error: null };
    }

    // 4. Handle Delete
    if (this.deleteAction) {
      const remainingRows = rows.filter(row => !this.matchFilters(row));
      const deletedCount = rows.length - remainingRows.length;
      db[this.table] = remainingRows;
      writeDb(db);
      return { data: null, count: deletedCount, error: null };
    }

    // 5. Handle Select / Query
    let filtered = rows.filter(row => this.matchFilters(row));

    if (this.distinctCols) {
      const seen = new Set();
      filtered = filtered.filter((row) => {
        const key = Array.isArray(this.distinctCols)
          ? this.distinctCols.map(col => row[col]).join('|')
          : row[this.distinctCols];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    if (this.orderCol) {
      filtered.sort((a, b) => {
        const valA = a[this.orderCol];
        const valB = b[this.orderCol];
        if (valA < valB) return this.orderAsc ? -1 : 1;
        if (valA > valB) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }

    if (this.skipVal !== null) {
      filtered = filtered.slice(this.skipVal);
    }

    if (this.limitVal !== null) {
      filtered = filtered.slice(0, this.limitVal);
    }

    if (this.head) {
      return { data: [], count: filtered.length, error: null };
    }

    if (this.isSingle) {
      if (filtered.length === 0) {
        return { data: null, count: 0, error: new Error('Row not found') };
      }
      return { data: filtered[0], count: 1, error: null };
    }

    if (this.isMaybeSingle) {
      return { data: filtered[0] || null, count: filtered.length ? 1 : 0, error: null };
    }

    return { data: filtered, count: filtered.length, error: null };
  }

  matchFilters(row) {
    for (const f of this.filters) {
      if (f.type === 'eq') {
        const rVal = row[f.col];
        if (rVal !== f.val) return false;
      } else if (f.type === 'neq') {
        const rVal = row[f.col];
        if (rVal === f.val) return false;
      } else if (f.type === 'gte') {
        const rVal = row[f.col];
        if (rVal < f.val) return false;
      } else if (f.type === 'lte') {
        const rVal = row[f.col];
        if (rVal > f.val) return false;
      } else if (f.type === 'in') {
        const rVal = row[f.col];
        if (!f.val.includes(rVal)) return false;
      } else if (f.type === 'or') {
        const parsed = parseOrFilter(f.val);
        if (!evalOrResults(row, parsed)) return false;
      }
    }
    return true;
  }
}

const mockAuth = {
  async signUp({ email, password, options }) {
    const db = readDb();
    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.users.find(u => u.email === normalizedEmail);
    if (existing) {
      return { data: { user: null, session: null }, error: new Error('User already exists') };
    }
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password_hash,
      user_metadata: options?.data || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);

    const token = `mock-jwt-token-for-${user.id}`;
    return { data: { user, session: { access_token: token } }, error: null };
  },

  async signInWithPassword({ email, password }) {
    const db = readDb();
    const normalizedEmail = email.toLowerCase().trim();
    const user = db.users.find(u => u.email === normalizedEmail);
    if (!user) {
      return { data: { user: null, session: null }, error: new Error('Invalid login credentials') };
    }

    // Support both hashed (password_hash) and legacy plain-text (password) fields
    let isValid = false;
    if (user.password_hash) {
      isValid = await bcrypt.compare(password, user.password_hash);
    } else if (user.password) {
      // Legacy plain-text comparison — auto-migrate to hashed on success
      isValid = (user.password === password);
      if (isValid) {
        user.password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        delete user.password;
        user.updated_at = new Date().toISOString();
        writeDb(db);
        console.log(`[Auth] Auto-migrated password to bcrypt hash for user ${user.email}`);
      }
    }

    if (!isValid) {
      return { data: { user: null, session: null }, error: new Error('Invalid login credentials') };
    }

    const token = `mock-jwt-token-for-${user.id}`;
    return { data: { user, session: { access_token: token } }, error: null };
  },

  async signOut() {
    return { error: null };
  },

  async getUser(token) {
    if (!token || !token.startsWith('mock-jwt-token-for-')) {
      return { data: { user: null }, error: new Error('Invalid token') };
    }
    const userId = token.replace('mock-jwt-token-for-', '');
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return { data: { user: null }, error: new Error('User not found') };
    }
    return { data: { user }, error: null };
  },

  admin: {
    async listUsers() {
      const db = readDb();
      return { data: { users: db.users }, error: null };
    },

    async createUser({ email, password, email_confirm, user_metadata }) {
      const db = readDb();
      const normalizedEmail = email.toLowerCase().trim();
      const existing = db.users.find(u => u.email === normalizedEmail);
      if (existing) {
        return { data: { user: existing }, error: null };
      }
      const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const user = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        password_hash,
        user_metadata: user_metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.users.push(user);
      writeDb(db);
      return { data: { user }, error: null };
    }
  }
};

const supabaseMock = {
  auth: mockAuth,
  from(table) {
    return new QueryBuilder(table);
  }
};

module.exports = supabaseMock;
