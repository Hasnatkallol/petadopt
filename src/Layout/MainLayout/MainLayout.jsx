import React from 'react';
import Navbar from '../../Component/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../../Shared/Footer';

const MainLayout = () => {
    return (
        <div className='border-5 w-full '>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="min-h-[calc(100vh-446px)]">
                <Outlet></Outlet>
            </div>
             <div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default MainLayout;