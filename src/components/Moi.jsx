import React, { useState } from 'react'
import data from "../assets/mois.json"
import "./Product.css";
import { MoiList } from './MoiList';
import { Slides } from './Slides';
export const Moi = () => {
    const [mois] = useState(data)
    return (
      <div>
        <div>
                            <Slides />
                        </div>
    <div className="product-container">
            {mois.map((product) => (
              <MoiList key={product.id} product = {product}  /> 
            ))}
        </div>
        </div>
      )
}
