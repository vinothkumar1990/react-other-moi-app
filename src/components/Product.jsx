import React from 'react'
import "./Product.css";
export const Product = ({product, cart, setCart}) => {
    const name = product.title.length>21?product.title.substring(0,20) + "...":product.title;
    console.log(cart)
    const addCart = () => {
        setCart([...cart, product]);
    };
    const removeCart = () => {
        setCart(cart.filter((c) => c.id !== product.id))
    };
    return (
    <div className="product">
        <div className="img">
             <img src={product.image} alt={product.title} />
        </div>
        <div className="details">
        <h3>{name}</h3>
        <p>Price Rs {product.price}</p>
        {
            cart.includes(product)?(
                <button className='btnRemove' onClick={removeCart}>Remove From Cart</button>
            ):(
                <button onClick={addCart}>Add from Cart</button>
            )
        }
        </div>
    </div>
  )
}
