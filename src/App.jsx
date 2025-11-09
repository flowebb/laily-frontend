import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Outer from './components/menu/Outer';
import Top from './components/menu/Top';
import Bottom from './components/menu/Bottom';
import Acc from './components/menu/Acc';
import Dress from './components/menu/Dress';
import Admin from './components/admin/Admin';
import ProductRegistration from './components/admin/ProductRegistration';
import MyPage from './components/MyPage';
import Cart from './components/Cart';
import Search from './components/Search';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/outer" element={<Outer />} />
        <Route path="/top" element={<Top />} />
        <Route path="/bottom" element={<Bottom />} />
        <Route path="/acc" element={<Acc />} />
        <Route path="/dress" element={<Dress />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products/new" element={<ProductRegistration />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
