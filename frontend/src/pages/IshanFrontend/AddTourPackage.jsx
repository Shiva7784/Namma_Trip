import React, { useState } from 'react';
import axios from 'axios';
import TpackageValidation from './TpackageValidation';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const AddTourPackage = () =>{

    const [errors, setErros] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const [packageId, setPackageId] = useState("");
    const [package_Title, setPackage_Title] = useState("");
    const [pCreateDate, setPCreateDate] = useState("");
    const [packageDes, setPackageDes] = useState("");
    const [pCategory, setPCategory] = useState("Adventure Tours");
    const [pImage, setPImage] = useState(null);
    const [packagePrice, setPackagePrice] = useState("");
    const [pDestination, setPDestination] = useState("");
    const [pDays, setPDays] = useState("");
    const url=import.meta.env.BACKEND_URL;

    const handleValidation = () => {
        const validationErrors = TpackageValidation(
            packageId,
            package_Title,
            pCreateDate,
            packagePrice,
            pDestination,
            pDays,
            isChecked
        );
        setErros(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }

    const navigate = useNavigate();

    const addPackage = (e) => {
        e.preventDefault();

        if(handleValidation()){
            const formData = new FormData();
            formData.append("packageId", packageId);
            formData.append("package_Title", package_Title);
            formData.append("pCreateDate", pCreateDate);
            formData.append("packageDes", packageDes);
            formData.append("pCategory", pCategory);
            formData.append("pImage", pImage);
            formData.append("packagePrice", packagePrice);
            formData.append("pDestination", pDestination);
            formData.append("pDays", pDays);
            console.log(url+"/tourPackage/AddTPackage", formData);
            
            axios.post(url+"/tourPackage/AddTPackage", formData).then(() => {
                toast.success('Tour Package Added Successfully!!');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);

            }).catch((err) => {
                
                if (err.response.status === 400) {
                    let errorMessage = 'Package ID already exists. Please use a different ID.';
                    toast.error(errorMessage);
                }else {
                    toast.error('Failed to add Tour Package. Please try again later.');

                }
            });

        }

    }

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Toaster />

            <div className='pt-10 pb-10'>
                <form onSubmit={addPackage} encType="multipart/form-data" className="max-w-4xl mx-auto border border-gray-300 p-4 rounded-lg bg-blue-50">
                    <h1 className="text-3xl font-bold pb-10 text-gray-800 pt-6 text-center">Add New Tour Package</h1>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="mb-8">
                            <label htmlFor="packageId" className="block mb-2 text-l font-medium text-black dark:text-white">Package ID</label>
                            <input type="text" id="packageId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPackageId(e.target.value);
                            }} required />
                            {errors.packageId && <p className="text-red-500 text-xs mt-1">{errors.packageId}</p>}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="package_Title" className="block mb-2 text-l font-medium text-black dark:text-white">Package Title</label>
                            <input type="text" id="package_Title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPackage_Title(e.target.value);
                            }} required />
                            {errors.package_Title && <p className="text-red-500 text-xs mt-1">{errors.package_Title}</p>}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pCreateDate" className="block mb-2 text-l font-medium text-black dark:text-white">Creation Date</label>
                            <input type="date" id="pCreateDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPCreateDate(e.target.value);
                            }} required />
                            {errors.pCreateDate && <p className="text-red-500 text-xs mt-1">{errors.pCreateDate}</p>}
                        </div> 

                        <div className="mb-8">
                            <label htmlFor="packageDes" className="block mb-2 text-l font-medium text-black dark:text-white">Package Description</label>
                            <textarea id="packageDes" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write package Description" 
                            onChange={(e) => {
                                setPackageDes(e.target.value);
                            }} required></textarea>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pCategory" className="block mb-2 text-l font-medium text-black dark:text-white">Select Package Category</label>
                            <select id="pCategory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPCategory(e.target.value);
                            }} required>
                                <option value="Adventure Tours">Adventure Tours</option>
                                <option value="Cultural Tours">Cultural Tours</option>
                                <option value="Wildlife and Nature Tours">Wildlife and Nature Tours</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block mb-2 text-l font-medium text-black dark:text-white" htmlFor="pImage">Upload Image</label>
                            <input name="pImage" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" aria-describedby="user_avatar_help" id="pImage" type="file" 
                            onChange={(e) => {
                                setPImage(e.target.files[0]);
                            }} required/>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="packagePrice" className="block mb-2 text-l font-medium text-black dark:text-white">Package Price</label>
                            <input type="number" id="packagePrice" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            min={0}
                            onChange={(e) => {
                                setPackagePrice(parseFloat(e.target.value));
                            }} required />
                            {errors.packagePrice && <p className="text-red-500 text-xs mt-1">{errors.packagePrice}</p>}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pDestination" className="block mb-2 text-l font-medium text-black dark:text-white">Destinations</label>
                            <input type="text" id="pDestination" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPDestination(e.target.value);
                            }} required />
                            {errors.pDestination && <p className="text-red-500 text-xs mt-1">{errors.pDestination}</p>}
                        </div>
                        
                        <div className="mb-8">
                            <label htmlFor="pDays" className="block mb-2 text-l font-medium text-black dark:text-white">Number Of Days</label>
                            <input type="number" id="pDays" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => {
                                setPDays(parseFloat(e.target.value));
                            }}
                            min={3} required/>
                            {errors.pDays && <p className="text-red-500 text-xs mt-1">{errors.pDays}</p>}
                        </div>
                    </div>

                    <div className="flex items-start mb-3">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"  
                            onChange={(e) =>
                                setIsChecked(e.target.checked)
                            }/>
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-black ml-2 dark:text-white">I confirm that the tour package details are accurate</label>
                    </div>
                    {errors.isChecked && <p className="text-red-500 text-xs mt-0 mb-8">{errors.isChecked}</p>}

                    <div className="flex justify-center mt-10 mb-8">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Create Package
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
  )
}

export default AddTourPackage;