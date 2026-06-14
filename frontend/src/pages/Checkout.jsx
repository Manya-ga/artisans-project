import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createRazorpayOrder, verifyPayment } from '../api';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, CreditCard, ShieldCheck, CheckCircle2, Truck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totals, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Payment
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({
    name: user?.displayName || '',
    phone: '',
    street: '',
    city: '',
    zip: '',
  });

  const subtotal = totals?.total || 0;
  const deliveryFee = subtotal > 999 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const isAddressValid = address.name && address.phone.length >= 10 && address.street && address.city && address.zip.length >= 6;

  const handlePayment = async () => {
    if (!user) {
      addToast('Please login to continue', 'error');
      return;
    }
    setBusy(true);
    try {
      const { orderId, amount, currency } = await createRazorpayOrder(total);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount,
        currency,
        name: 'Artisan Connect',
        description: 'Quality Handcrafted Items',
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address,
            });
            clearCart();
            setStep(4);
            addToast('Order placed successfully! ✨');
          } catch (err) {
            addToast('Payment verification failed', 'error');
          }
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#ec4899' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      addToast(err?.message || 'Payment failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (cartCount === 0 && step !== 4) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate('/')} className="mt-8 btn-primary px-10 py-4">Start Shopping</button>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-fade-in flex flex-col items-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-soft">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Order Successful!</h2>
        <p className="text-gray-500 mt-4 font-medium">Your artisan treasures are on their way to you.</p>
        <div className="mt-10 flex flex-col w-full gap-3">
          <button onClick={() => navigate('/')} className="btn-primary py-4">Continue Shopping</button>
          <button onClick={() => navigate('/profile')} className="btn-outline py-4">View My Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Steps */}
        <div className="flex-1 space-y-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
 
          <div className="flex items-center gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
            <StepIndicator number={1} label="Address" active={step === 1} completed={step > 1} />
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <StepIndicator number={2} label="Review" active={step === 2} completed={step > 2} />
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <StepIndicator number={3} label="Payment" active={step === 3} completed={step > 3} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="address"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="card-premium p-8 space-y-8"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-pink-500" />
                  <h3 className="text-2xl font-black text-gray-900">Shipping Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Receiver Name" name="name" value={address.name} onChange={handleInputChange} placeholder="E.g. Jane Doe" />
                  <Input label="Phone Number" name="phone" value={address.phone} onChange={handleInputChange} placeholder="10-digit mobile number" />
                  <div className="md:col-span-2">
                    <Input label="Delivery Address" name="street" value={address.street} onChange={handleInputChange} placeholder="House No, Building, Street Name" />
                  </div>
                  <Input label="City" name="city" value={address.city} onChange={handleInputChange} placeholder="Bangalore" />
                  <Input label="Pincode" name="zip" value={address.zip} onChange={handleInputChange} placeholder="560001" />
                </div>
                <button 
                  disabled={!isAddressValid}
                  onClick={() => setStep(2)}
                  className="w-full btn-primary py-5 rounded-2xl text-lg font-black disabled:grayscale"
                >
                  Continue to Review
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="card-premium p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-900">Review Details</h3>
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-pink-600 hover:underline">Change Address</button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{address.name}</p>
                      <p className="text-sm text-gray-500 mt-1 font-medium">{address.street}</p>
                      <p className="text-sm text-gray-500 font-medium">{address.city}, {address.zip}</p>
                      <p className="text-sm text-gray-900 font-bold mt-2">Mobile: {address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-400" /> Items in Order
                  </h3>
                  <div className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="py-4 flex gap-4 items-center">
                        <img src={item.image} className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm" alt="" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-400 font-medium">Qty: {item.qty} × ₹{item.price}</p>
                        </div>
                        <p className="font-black text-gray-900">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => setStep(3)}
                  className="w-full btn-primary py-5 rounded-2xl text-lg font-black"
                >
                  Proceed to Payment
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="card-premium p-10 text-center space-y-10"
              >
                <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CreditCard className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Payment Selection</h3>
                  <p className="text-gray-500 mt-2 font-medium">Safe and encrypted payment via Razorpay Secure Gateway</p>
                </div>
                <div className="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-32 h-32" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest Final Amount to Pay"></p>
                  <p className="text-5xl font-black mt-2">₹{total.toFixed(0)}</p>
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={busy}
                  className="w-full btn-primary py-6 rounded-3xl text-xl font-black shadow-elevated disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {busy ? 'Securing Transaction...' : 'Pay Now Securely'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-[450px]">
          <div className="sticky top-32 card-premium p-10 space-y-8">
            <h3 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">Order Summary</h3>
            <div className="space-y-5">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Items Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Delivery Charges</span>
                <span className={deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Grand Total</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-pink-500">₹{total.toFixed(0)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-black text-center text-gray-500 uppercase tracking-tighter">100% Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-black text-center text-gray-500 uppercase tracking-tighter">Artisan Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StepIndicator = ({ number, label, active, completed }) => (
  <div className={`flex items-center gap-3 shrink-0 ${active ? 'scale-105' : ''} transition-all`}>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
      completed ? 'bg-green-100 text-green-600' : 
      active ? 'bg-pink-500 text-white shadow-elevated' : 'bg-gray-100 text-gray-400'
    }`}>
      {completed ? <CheckCircle2 className="w-6 h-6" /> : number}
    </div>
    <span className={`text-sm font-black ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2.5">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">{label}</label>
    <input 
      {...props} 
      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
    />
  </div>
);
