import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Best from './components/menu/Best';
import New from './components/menu/New';
import Outer from './components/menu/Outer';
import Top from './components/menu/Top';
import Bottom from './components/menu/Bottom';
import Acc from './components/menu/Acc';
import Dress from './components/menu/Dress';
import Sale from './components/menu/Sale';
import Admin from './components/admin/Admin';
import ProductList from './components/admin/ProductList/ProductList';
import ProductEdit from './components/admin/ProductList/ProductEdit';
import ProductRegistration from './components/admin/newProductRegistration/ProductRegistration';
import MyPage from './components/MyPage';
import Cart from './components/Cart';
import Search from './components/Search';
import ProductDetail from './components/ProductDetail/ProductDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/best" element={<Best />} />
        <Route path="/new" element={<New />} />
        <Route path="/outer" element={<Outer />} />
        <Route path="/top" element={<Top />} />
        <Route path="/bottom" element={<Bottom />} />
        <Route path="/acc" element={<Acc />} />
        <Route path="/dress" element={<Dress />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/new" element={<ProductRegistration />} />
        <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
