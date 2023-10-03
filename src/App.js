import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import Aggrid from './components/aggrid';
import TypeAhead from './components/TypeAhead';

import 'bootstrap/dist/css/bootstrap.min.css';


import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

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


const baseURL = "https://amruthestore.azurewebsites.net/api/";
// const baseURL = "https://localhost:7007/api/";
function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [product, setProduct] = useState(productInitialValues)

  const [token, setToken] = useState("");
  useEffect(() => {

    axios.post(baseURL + "Authenticate/AuthToken", {
      userName: "admin@admin.com",
      password: "123"

    }).then(res => {
      console.log(res.data);
      res.data.isSuccess && setToken(res.data.token);
    }).catch(err => {
      console.error(err);
    })
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

  return (
    <div className="App">
      <Aggrid></Aggrid>
      {/* <TypeAhead /> */}
      {/* <header className="App-header">
        <img
          img={imageSrc}
          width={100}
          height={100}
          alt="Test Images"
        />
        <input type={"file"} onChange={changeImageHandler} />
        <button onClick={handlerUploadProductImage}>Upload</button>
        <a
          href={imageSrc}
          download
          onClick={e => download(e)}
        >
          <i className="fa fa-download" />
          download
        </a>

      </header> */}

    </div>
  );
}

export default App;
