import React from 'react'
import { Image } from 'react-bootstrap';
import "./Moi.css";
import image2 from '../assets/images/image2.jpg';
export const MoiList = ({product}) => {
    const name = product.name.length>21?product.name.substring(0,20) + "...":product.name;

    return (
    <div className="product">
        <div className="img">
             <Image src={image2} fluid />
        </div>
        <div className="details">
        <h3>{name}</h3>
        <p>Place : {product.place}</p>
        <p>Old Amount : {product.old_amount}</p>
        <p>New Amount : {product.new_amount}</p>
        <p>Status Amount : {product.given_amount_status}</p>
        <p>Status : {product.status}</p>
        </div>
    </div>
  )
}
