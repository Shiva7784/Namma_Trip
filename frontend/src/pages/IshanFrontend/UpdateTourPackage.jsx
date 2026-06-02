import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateValidations from './UpdateValidations';
import toast, { Toaster } from "react-hot-toast";

const UpdateTourPackage = () => {
    const {id} = useParams();
    const url=import.meta.env.BACKEND_URL;

    const [values, setValues] = useState({
        id: id,
        packageId: '',
        package_Title: '',
        pCreateDate: '',
        packageDes: '',
        pCategory: '',
        pImage: '',
        packagePrice: 0,
        pDestination: '',
        pDays: 0,
        isChecked: false
    });

    useEffect(() => {
        axios.get(url+`tourPackage/get/${id}`).then((response) => {
            const packageData = response.data.package;
            setValues({
                packageId: packageData.packageId,
                package_Title: packageData.package_Title,
                pCreateDate: packageData.pCreateDate,
                packageDes: packageData.packageDes,
                pCategory: packageData.pCategory,
                pImage: packageData.pImage,
                packagePrice: packageData.packagePrice,
                pDestination: packageData.pDestination,
                pDays: packageData.pDays
            });
        }).catch((err) => {
            console.error('Error:', err);
        });
        window.scrollTo(0, 0);
    }, [id]);
    
    const [errors, setErrors] = useState({});

    const handleValidation = () => {
        const validationErrors = UpdateValidations(values);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const navigate = useNavigate();

    const updatePackage = (e) => {
        e.preventDefault();
    
        if (handleValidation()) {
            const formData = new FormData();
            
            Object.keys(values).forEach(key => {
                if (key === 'pImage' && typeof values[key] === 'object') {
                    formData.append(key, values[key]);
                } else if (key !== 'pImage') {
                    formData.append(key, values[key]);
                }
            });
    
            axios.put(url+`/tourPackage/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                toast.success('Tour Package Updated Successfully!');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
                
            }).catch((err) => {
                toast.error('Error with Updating Tour Package');
                console.error('Error:', err);
            });
        }
    };

    return (
        
        <div className='bg-gray-100 min-h-screen'>
            <Toaster />

            <div className='pt-10 pb-10'>
                <form onSubmit={updatePackage} encType="multipart/form-data" className="max-w-4xl mx-auto border border-gray-300 p-4 rounded-lg bg-blue-50">
                    <h1 className="text-3xl font-bold pb-10 text-gray-800 pt-6 text-center">Update Tour Package</h1>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="mb-8">
                            <label htmlFor="packageId" className="block mb-2 text-l font-medium text-black dark:text-white">Package ID</label>
                            <input type="text" id="packageId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.packageId}
                            onChange={(e) => {
                                setValues({...values, packageId: e.target.value});
                            }} required disabled/>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="package_Title" className="block mb-2 text-l font-medium text-black dark:text-white">Package Title</label>
                            <input type="text" id="package_Title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.package_Title}
                            onChange={(e) => {
                                setValues({...values, package_Title: e.target.value});
                            }} required />
                            {errors.package_Title && <p className="text-red-500 text-xs mt-1">{errors.package_Title}</p>}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pCreateDate" className="block mb-2 text-l font-medium text-black dark:text-white">Creation Date</label>
                            <input type="date" id="pCreateDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.pCreateDate}
                            onChange={(e) => {
                                setValues({...values, pCreateDate: e.target.value});
                            }} required disabled/>
                        </div> 

                        <div className="mb-8">
                            <label htmlFor="packageDes" className="block mb-2 text-l font-medium text-black dark:text-white">Package Description</label>
                            <textarea id="packageDes" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write package Description" 
                            value={values.packageDes}
                            onChange={(e) => {
                                setValues({...values, packageDes: e.target.value});
                            }} required></textarea>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pCategory" className="block mb-2 text-l font-medium text-black dark:text-white">Select Package Category</label>
                            <select id="pCategory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.pCategory}
                            onChange={(e) => {
                                setValues({...values, pCategory: e.target.value});
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
                                setValues({...values, pImage: e.target.files[0]});
                            }} />
                        </div>

                        <div className="mb-8">
                            <label htmlFor="packagePrice" className="block mb-2 text-l font-medium text-black dark:text-white">Package Price</label>
                            <input type="number" id="packagePrice" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={(values.packagePrice).toFixed(2)}
                            onChange={(e) => {
                                setValues({...values, packagePrice: parseFloat(e.target.value)});
                            }} 
                            min={0} required />
                            {errors.packagePrice && <p className="text-red-500 text-xs mt-1">{errors.packagePrice}</p>}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="pDestination" className="block mb-2 text-l font-medium text-black dark:text-white">Destinations</label>
                            <input type="text" id="pDestination" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.pDestination}
                            onChange={(e) => {
                                setValues({...values, pDestination: e.target.value});
                            }} required />
                            {errors.pDestination && <p className="text-red-500 text-xs mt-1">{errors.pDestination}</p>}
                        </div>
                        
                        <div className="mb-8">
                            <label htmlFor="pDays" className="block mb-2 text-l font-medium text-black dark:text-white">Number Of Days</label>
                            <input type="number" id="pDays" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={values.pDays}
                            onChange={(e) => {
                                setValues({...values, pDays: parseFloat(e.target.value)});
                            }} 
                            min={3} required />
                            {errors.pDays && <p className="text-red-500 text-xs mt-1">{errors.pDays}</p>}
                        </div>
                    </div>

                    <div className="flex items-start mb-3">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"  
                            onChange={(e) =>
                                setValues({...values, isChecked: e.target.checked})
                            }/>
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-black dark:text-gray-300 ml-2">I confirm that the tour package details are accurate</label>
                    </div>
                    {errors.isChecked && <p className="text-red-500 text-xs mt-0 mb-8">{errors.isChecked}</p>}

                    <div className="flex justify-center mt-10 mb-8">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Update Package
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    )
}
export default UpdateTourPackage;