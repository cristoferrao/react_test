import './App.css';
import { useEffect, useState } from 'react';

import axios from 'axios';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';


import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import useRazorpay from 'react-razorpay';

const productInitialValues = {
  name: "Test Images",
  shortName: "Test",
  description: "sad",
  shortCode: "44",
  brandId: 1,
  imageUrl: "",
  price: 10,
  active: true,
  createdBy: 0,
  gst: 5,
  sgstAmount: 2.5,
  cgstAmount: 2.5,
  igstAmount: 5,
  imageFile: ""
};


// const baseURL = "https://amruthestore.azurewebsites.net/api/";
const baseURL = "https://localhost:7007/api/";

function App() {

  const [imageSrc, setImageSrc] = useState(null);
  const [product, setProduct] = useState(productInitialValues)

  const [token, setToken] = useState("");
  useEffect(() => {

    loginHandler();
    return () => {

    }
  }, [])

  const download = e => {
    console.log(e.target.href);
    fetch(e.target.href, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };


  useEffect(() => {

    token !== "" && categoryCall();

    return () => {

    }

    function categoryCall() {
      axios.get(baseURL + "app/Categories/",
        { headers: { Authorization: `Bearer ${token}` }, }
      )
        .then(res => {
          console.log(res);
          setImageSrc(res.data[0] && res.data[0].image);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [token])

  const handlerUploadProductImage = () => {


    const formData = new FormData();



    formData.append("file", product.imageFile)
    formData.append("classificationId", 10)

    axios.post(baseURL + "app/Classifications/UploadClassificationImage/", formData,
      { headers: { Authorization: `Bearer ${token}` }, }
    )
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const changeImageHandler = (params) => {
    if (params.target.files && params.target.files[0]) {

      setProduct({
        ...product,
        imageFile: params.target.files[0]
      });
    }
  }

  const Razorpay = useRazorpay();
  const [order, setOrder] = useState({
    id: null,
    orderId: ""
  })

  const handlePayment = () => {
    const options = {
      key: "rzp_test_wN0Sc7TinY22q3",
      amount: parseInt(order.amount),
      currency: "INR",
      name: "Acme Corp",
      description: order.orderId + "",
      image: "https://example.com/your_logo",
      order_id: order.orderId,
      handler: (res) => {
        console.log(res);

      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "7972930120",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);

    rzpay.on("", () => {

    })
    rzpay.open();

  }

  const OrderCall = () => {
    axios.post("https://localhost:7007/api/app/Payments/CreatePaymentOrder",
      {
        billingName: "string",
        city: "string",
        state: "string",
        pincode: "string",
        country: "string",
        billingGST: "string",
        email: "string",
        mobile: "string",
        notes: "string"
      }
      , { headers: { Authorization: `Bearer ${token}` }, })
      .then(res => {
        console.log(res);
        setOrder(res.data);
      }).catch(err => {
        console.log(err);
      });
  }
  return (
    <div className="App">
      <button className='btn btn-success' type='button' onClick={loginHandler}>Login</button>
      {/* <Aggrid></Aggrid> */}

      <button onClick={OrderCall}
      >Order</button>

      <button className='m-2 btn btn-success' onClick={handlePayment}>Pay</button>
    </div>
  );

  function loginHandler() {
    axios.post(baseURL + "Authenticate/AuthToken", {
      userName: "admin@admin.com",
      password: "123"
    }).then(res => {
      console.log(res.data);
      res.data.isSuccess && setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data))
    }).catch(err => {
      console.error(err);
    });
  }
}

export default App;
