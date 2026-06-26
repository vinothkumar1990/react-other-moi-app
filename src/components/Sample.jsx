import React, { useEffect } from 'react';
import { Commet } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Sample = () => {
    const navigate = useNavigate();
    const {products, error, isLoading, setProducts} = useFetch(
         "https://68ea6044f1eeb3f856e7108e.mockapi.io/income"
    );
    const handleDelete= (id)=>{
        axios.delete(
            `https://68ea6044f1eeb3f856e7108e.mockapi.io/income/${id}`
        )

    }
    const handleEdit = (id) => {
        navigate(`/update_sample/${id}`)
    }
  if (isLoading){
    return(
       <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Commet color="blue" size="medium" />
      </div>
    );

  }  
 return (
    <div>
    <div>
        <button onClick = {()=> navigate('/addnew')}> Add New </button>
        </div>
        <div>
    <table border="1" style={{ width: "100%", textAlign: "center" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, index) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.amount}</td>
            <td>{item.type}</td>
            <td>{item.description}</td>
            <td>
                <button onClick={()=> handleEdit(item.id)} > Edit </button>
            </td>
            <td>
                <button onClick={()=> handleDelete(item.id)} > Delete </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  );
}
