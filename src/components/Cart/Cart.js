import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const[isCheckout, setIsCheckout]= useState(false);
  const [isSubmitting, setIsSubmitting]=useState(false);
  const [didSubmit, setDidSubmit]=useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler =()=> {
    setIsCheckout(true); 
  };
  
  const submitOrderHandler=async (userData)=> {
    setIsSubmitting(true);
    const response = await fetch('https://http-request-react-ab6db-default-rtdb.europe-west1.firebasedatabase.app/order.json',{
      method: 'POST',
      body : JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );



  const modalAction = <div className={classes.actions}>
  <button className={classes['button--alt']} onClick={props.onClose}>
    Close
  </button>
  {hasItems && (
    <button className={classes.button} onClick={orderHandler}>
      Order
    </button>
    )}
</div>

    const cartMondalContent=
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout &&<Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
      {!isCheckout && modalAction}
    </>

    const isSubmittingModalContent = <p>Sending order date...</p>
    const didSubmitModalContent = <p>Successfully sent the order.</p>


  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartMondalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}

    </Modal> 
  );
};

export default Cart;