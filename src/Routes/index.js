import { Routes, Route, useNavigate } from "react-router-dom";

import Home from '../Pages/Home';
import Error from '../Pages/Error';

function RoutesApp(){

    const navigate = useNavigate();

    // Function to navigate to the products page with a search query
    const navigateToProductsWithSearch = (searchQuery) => {
        navigate(`/products?search=${searchQuery}`);
    };

    return(
        
            <Routes>

                <Route path="/" element={<Home/> }/>
                {/* <Route path="/products" element={<Private> <Products navigateToProductsWithSearch={navigateToProductsWithSearch} /> </Private>}/> */}
                {/* <Route path="/profile" element={<Profile/>}/> */}

                <Route path="*" element={ <Error/> }/>
            </Routes>
        
    );
}

export default RoutesApp;