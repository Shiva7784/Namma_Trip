import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTourPackage from "../pages/IshanFrontend/AddTourPackage";
import TourPackageUser from "../pages/IshanFrontend/TourPackageUser";
import IndivudualPackage from "../pages/IshanFrontend/IndivudualPackage";
import QuotationForm from "../pages/IshanFrontend/QuotationForm";
import AdminUpdateTour from "../pages/dashboard/Ishan Dashboard/UpdatePackageDashboard"
import Home from "../pages/landing/Home";
import Admin from "../pages/dashboard/Admin";
import About from "../pages/common/About";
import Contact from "../pages/common/Contact";
import Login from "../pages/login/Login"
import Signup from "../pages/signup/Signup"
import Onboarding from "../pages/Dinitha/Onboarding"
import Profile from "../pages/Dinitha/Profile"
import ProtectedRoute from "../components/ProtectedRoute"
import GuestRoute from "../components/GuestRoute"
import NotFound from "../components/spinner/404"
import Test from  "../components/test"
import PaymentForm from "../components/PaymentForm";
import PaymentSuccess from "../components/PaymentSuccess";
import AI from "../components/TripPlanner"

import AddEquipment from "../pages/sakindu/AddEquipment";
import UpdateEquipment from "../pages/sakindu/UpdateEquipment"
import EquipmentUserView from "../pages/sakindu/EquipmentList"
import IndividualEquipment from "../pages/sakindu/IndividualEquipment"; 
import AdminUpdateEquipment from "../pages/dashboard/Sakindu Dashbaord/UpdateEquipment";

import TourismBlog from "../pages/Ishanka/UserBlog"
import IndividualBlog from "../pages/Ishanka/InduvidualBlog";
import UpdateBlogDashboard from "../pages/dashboard/Ishanka dahsbaord/UpdateBlogDashbaord";

import AddBlog from "../pages/Ishanka/AddBlog";
import BookingForm from "../pages/Jihan/BookingForm";
import Confirmation from "../pages/Jihan/Confirmation";
import EditBooking from "../pages/Jihan/Confirmation";
import BookingList from "../pages/Jihan/BookingList"

import AddTicket from "../pages/ticket/AddTicket"; // Import AddTicket component
import ViewTicket from "../pages/ticket/ViewTicket"; // Import ViewTicket component
import AllTickets from "../pages/ticket/AllTickets"; // Import AllTickets component
import EditTicketPage from "../pages/ticket/EditTicketPage"; // Import EditTicketPage component
import EditSupportTicketPage from "../pages/ticket/EditSupportTicketPage"; // Import EditSupportTicketPage component
import SupportAgentTicket from "../pages/ticket/SupportAgentTickets"; // Adjust the import path as necessary

import AddDestination from "../pages/destination/addDestination";
import AllDestination from "../pages/destination/allDestination";
import EditDestinationPage from "../pages/destination/EditDestinationPage";
import DestinationList from "../pages/destination/DestinationList";
import DestinationDetail from "../pages/destination/DestinationDetail";
import DestinationAnalytics from "../pages/destination/DestinationAnalytics";


function AppRoutes() {
    return (
        <Router>
            <Routes>
                
                <Route path="/addequipment" element={<AddEquipment />} />
                <Route path="/updateequipment/:id" element={<UpdateEquipment />} />
                <Route path="/userequipment" element={<EquipmentUserView />} />
                <Route path="/equipment/:id" element={<IndividualEquipment />} />

                <Route path="/Equipment-dashboard/updateequipment/:id" element={<AdminUpdateEquipment />} />
           
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                    <Route path="/onboarding" element={<ProtectedRoute> <Onboarding /> </ProtectedRoute> } />
                    <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute adminOnly>
                                <Admin />
                            </ProtectedRoute>
                        } 
                    />

                     
                    <Route path="*" element={<NotFound />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/payment" element={<PaymentForm />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/ai" element={<AI />} />


                    <Route path="/dashboard/addTourPackages" element={<AddTourPackage />} />
                    <Route path="/dashboard/manageTourPackages/:id" element={<AdminUpdateTour />} />
                    <Route path="/tour-packages" element={<TourPackageUser />} />
                <Route path="/tour-packages/:id" element={<IndivudualPackage />} />
                <Route path="/quotationForm" element={<QuotationForm />} />

                <Route path="/add-blog" element={<AddBlog />} />
                <Route path="/update-blog/:id" element={<UpdateBlogDashboard />} />
                <Route path="/user-blog" element={<TourismBlog />} />
                <Route path ="/blog/:id" element = {<IndividualBlog />} />

                <Route path="/book/:id" element={<ProtectedRoute> <BookingForm /> </ProtectedRoute>} />
                <Route path="/confirmation" element={<Confirmation /> } />
                <Route path="/bookings" element={<BookingList />} />
                <Route path="/book/:id" element={<EditBooking />} /> 

                <Route path="/tickets" element={<AllTickets />} /> {/* Route for All Tickets */}
                <Route path="/tickets/add" element={<AddTicket />} /> {/* Route for Adding a Ticket */}
                <Route path="/tickets/:id" element={<ViewTicket />} /> {/* Route for Viewing a Specific Ticket */}
                <Route path="/tickets/edit/:ticketID" element={<EditTicketPage />} /> {/* Route for Editing a Ticket */}
                <Route path="/tickets/edit-support/:ticketID" element={<EditSupportTicketPage />} /> {/* Route for Editing a Support Ticket */}
                <Route path="/dashboard/support-agent-tickets" element={<SupportAgentTicket />} />
                

                <Route path="/dashboard/add-destination" element={<AddDestination />} />
                <Route path="dashboard/view-destinations" element={<AllDestination />} />
                <Route path="/edit-destination/:id" element={<EditDestinationPage />} />
                <Route path="/destinations" element={<DestinationList />} />
                <Route path="/destination/:id" element={<DestinationDetail />} />
                <Route path="/analytics" element={<DestinationAnalytics />} />
             
                </Routes>
                    
            </Router>
        
    );
}

export default AppRoutes;

