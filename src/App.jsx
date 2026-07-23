import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { KovilIncome } from "./components/KovilIncome";
import { Cart } from "./components/Cart";
import { Moi } from "./components/Moi";
import { MoiFilter } from "./components/MoiFilter";
import { Pending } from "./components/Pending";
import { Completed } from "./components/Completed";
import { Large } from "./components/Large";
//import { VinothMoi } from "./components/VinothMoi";
//import { VigneshMoi } from "./components/VigneshMoi";
//import { VijayMoi } from "./components/VijayMoi";
import { AllMoiList } from "./components/AllMoiList";
import { PendingGroup } from "./components/PendingGroup";
import { CompletedGroup } from "./components/CompletedGroup";
import { NewMoi } from "./components/NewMoi";
import { Chart } from "./components/Chart";
import { User } from "./components/User";
import { UpdateMoi } from "./components/UpdateMoi";
import { KovilOutgoing } from "./components/KovilOutgoing";
import { NewIncome } from "./components/NewIncome";
import { NewOutgoing } from "./components/NewOutgoing";
import { UpdateIncome } from "./components/UpdateIncome";
import { UpdateOutgoing } from "./components/UpdateOutgoing";
import { KovilSummary } from "./components/KovilSummary";
import { IncomeGroup } from "./components/IncomeGroup";
import { OutgoingGroup } from "./components/OutgoingGroup";
import { Sample } from "./components/Sample";
import { NewSample } from "./components/NewSample";
import { UpdateSample } from "./components/UpdateSample";
import { Relo } from "./components/Relo";
import { UpdateRelo } from "./components/UpdateRelo";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated, getUserRole } from "./utils/auth";
import { NewRelo } from "./components/NewRelo";
import { VinothRelo } from "./components/VinothRelo";
import { VigneshRelo } from "./components/VigneshRelo";
import { VijayRelo } from "./components/VijayRelo";
import { PendingGroupRelo } from "./components/PendingGroupRelo";
import { CompleteGroupRelo } from "./components/CompleteGroupRelo";
import { ChartRelo } from "./components/ChartRelo";
import { PendingListRelo } from "./components/PendingListRelo";
import { CompleteListRelo } from "./components/CompleteListRelo";
import { MoiSearchRelo } from "./components/MoiSearchRelo";
import { AllGroupRelo } from "./components/AllGroupRelo";
import { Loan } from "./components/Loan";
import { NewLoan } from "./components/NewLoan";
import { UpdateLoan } from "./components/UpdateLoan";
import { AllGroupLoan } from "./components/AllGroupLoan";
import { PlaceGroupLoan } from "./components/PlaceGroupLoan";
import { KovilBalance } from "./components/KovilBalance";
import { NewBalance } from "./components/NewBalance";
import { UpdateBalance } from "./components/UpdateBalance";
import { PlaceGroup } from "./components/PlaceGroup";
import { PendingPlaceGroup } from "./components/PendingPlaceGroup";
import { CompletedPlaceGroup } from "./components/CompletedPlaceGroup";
import { GivenStatusGroup } from "./components/GivenStatusGroup";
import { UpdateUser } from "./components/UpdateUser";
import SignUp from "./components/SignUp";
import { OutgoingDateGroup } from "./components/OutgoingDateGroup";
import { IncomeDateGroup } from "./components/IncomeDateGroup";
import { NewDonationIncome } from "./components/NewDonationIncome";
import { NewDonationOutgoing } from "./components/NewDonationOutgoing";
import { DonationIncome } from "./components/DonationIncome";
import { DonationOutgoing } from "./components/DonationOutgoing";
import { UpdateDonationIncome } from "./components/UpdateDonationIncome";
import { UpdateDonationOutgoing } from "./components/UpdateDonationOutgoing";
import { DonationIncomeGroup } from "./components/DonationIncomeGroup";
import { DonationOutgoingGroup } from "./components/DonationOutgoingGroup";
import { DonationOutgoingDateGroup } from "./components/DonationOutgoingDateGroup";
import { DonationSummary } from "./components/DonationSummary";
import DataMigration from "./components/DataMigration";
import { DataBackup } from "./components/DataBackup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { NannuMoi } from "./components/NannuMoi";
import { MoiProvider } from "./context/MoiProvider";
import { MoiAllProvider } from "./context/MoiAllProvider";
import { MoiAllGroupProvider } from "./context/MoiAllGroupProvider";
import { MoiSearchProvider } from "./context/MoiSearchProvider";
import { KovilAllProvider } from "./context/KovilAllProvider";
import { KovilOutAllProvider } from "./context/KovilOutAllProvider";
import { BalanceAllProvider } from "./context/BalanceAllProvider";
function App() {
  const [cart, setCart] = useState([]);
  // Disable Right Click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Block F12, Ctrl+Shift+I, Ctrl+U
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Detect DevTools Open (Trick Method)
  useEffect(() => {
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        alert("DevTools is not allowed!");
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize default users (only once)
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const defaultUsers = [
      { email: "admin@gmail.com", password: "admin123", role: "admin" },
      { email: "customer@gmail.com", password: "cust123", role: "customer" },
    ];

    defaultUsers.forEach((user) => {
      if (!users.find((u) => u.email === user.email)) {
        users.push(user);
      }
    });

    localStorage.setItem("users", JSON.stringify(users));
  }, []);

  // Redirect based on role
  const HomeRedirect = () => {
    const role = getUserRole();
    console.log(role);

    // If no role (not logged in)
    if (!role) {
      return <Navigate to="/login" replace />;
    }
    if (role === "customer") {
      return <Navigate to="/kovil/income_list" replace />;
    }
    // Admin or Free role → Home
    if (role === "admin" || role === "free" || "super-admin") {
      return <Home />;
    }
    // ✅ Customer / Free → Income List
    // Default → KovilIncome
    // return <KovilIncome />;
  };

  return (
    <BrowserRouter>
      <Header cart={cart} />

      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!isAuthenticated() ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/nannu-register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeRedirect />
              </PrivateRoute>
            }
          />

          <Route
            path="/Moi"
            element={
              <PrivateRoute>
                <Moi />
              </PrivateRoute>
            }
          />

          <Route
            path="/moi_search"
            element={
              <PrivateRoute>
                <MoiFilter />
              </PrivateRoute>
            }
          />

          <Route
            path="/Cart"
            element={
              <PrivateRoute>
                <Cart cart={cart} setCart={setCart} />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending_list"
            element={
              <PrivateRoute>
                <Pending />
              </PrivateRoute>
            }
          />

          <Route
            path="/completed_list"
            element={
              <PrivateRoute>
                <Completed />
              </PrivateRoute>
            }
          />

          <Route
            path="/large_amount_list"
            element={
              <PrivateRoute>
                <Large />
              </PrivateRoute>
            }
          />

          {/*<Route
            path="/vinoth_mois"
            element={
              <PrivateRoute>
                <VinothMoi />
              </PrivateRoute>
            }
          />

          <Route
            path="/vignesh_mois"
            element={
              <PrivateRoute>
                <VigneshMoi />
              </PrivateRoute>
            }
          />

          <Route
            path="/vijay_mois"
            element={
              <PrivateRoute>
                <VijayMoi />
              </PrivateRoute>
            }
          />*/}

          <Route
            path="/all_mois"
            element={
              <PrivateRoute>
                <AllMoiList />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending_name_group"
            element={
              <PrivateRoute>
                <PendingGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/completed_name_group"
            element={
              <PrivateRoute>
                <CompletedGroup />
              </PrivateRoute>
            }
          />

          <Route
            path="/dash_board"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/newMoi"
            element={
              <PrivateRoute>
                <NewMoi />
              </PrivateRoute>
            }
          />

          <Route
            path="/charts"
            element={
              <PrivateRoute>
                <Chart />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_moi/:id"
            element={
              <PrivateRoute>
                <UpdateMoi />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/income_list"
            element={
              <PrivateRoute>
                <KovilAllProvider>
                  <KovilIncome />
                </KovilAllProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/kovil/balances"
            element={
              <PrivateRoute>
                <BalanceAllProvider>
                  <KovilBalance />
                </BalanceAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/new/balance"
            element={
              <PrivateRoute>
                <NewBalance />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_balance/:id"
            element={
              <PrivateRoute>
                <UpdateBalance />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/outgoing_list"
            element={
              <PrivateRoute>
                <KovilOutAllProvider>
                  <KovilOutgoing />
                </KovilOutAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/newIncome"
            element={
              <PrivateRoute>
                <NewIncome />
              </PrivateRoute>
            }
          />

          <Route
            path="/newOutgoing"
            element={
              <PrivateRoute>
                <NewOutgoing />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_income/:id"
            element={
              <PrivateRoute>
                <UpdateIncome />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_outgoing/:id"
            element={
              <PrivateRoute>
                <UpdateOutgoing />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/summary"
            element={
              <PrivateRoute>
                <KovilSummary />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/income_group"
            element={
              <PrivateRoute>
                <KovilAllProvider>
                  <IncomeGroup />
                </KovilAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/outgoing_group"
            element={
              <PrivateRoute>
                <KovilOutAllProvider>
                  <OutgoingGroup />
                </KovilOutAllProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/kovil/income_date_group"
            element={
              <PrivateRoute>
                <IncomeDateGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/kovil/outgoing_date_group"
            element={
              <PrivateRoute>
                <OutgoingDateGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/income/new"
            element={
              <PrivateRoute>
                <NewDonationIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/outgoing/new"
            element={
              <PrivateRoute>
                <NewDonationOutgoing />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/incomes"
            element={
              <PrivateRoute>
                <DonationIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/outgoings"
            element={
              <PrivateRoute>
                <DonationOutgoing />
              </PrivateRoute>
            }
          />
          <Route
            path="/update_donation_income/:id"
            element={
              <PrivateRoute>
                <UpdateDonationIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/update_donation_outgoing/:id"
            element={
              <PrivateRoute>
                <UpdateDonationOutgoing />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/income_group"
            element={
              <PrivateRoute>
                <DonationIncomeGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/outgoing_group"
            element={
              <PrivateRoute>
                <DonationOutgoingGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/outgoing_date_group"
            element={
              <PrivateRoute>
                <DonationOutgoingDateGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/summary"
            element={
              <PrivateRoute>
                <DonationSummary />
              </PrivateRoute>
            }
          />
          <Route
            path="/all"
            element={
              <PrivateRoute>
                <MoiAllProvider>
                  <Relo />
                </MoiAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/update_relo/:id"
            element={
              <PrivateRoute>
                <UpdateRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/new/moi"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <NewRelo />
                </MoiProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/vinoth/mois"
            element={
              <PrivateRoute>
                <VinothRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/vignesh/mois"
            element={
              <PrivateRoute>
                <VigneshRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/vijay/mois"
            element={
              <PrivateRoute>
                <VijayRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending/name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PendingPlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/moi_create/upload"
            element={
              <PrivateRoute>
                <DataMigration />
              </PrivateRoute>
            }
          />
          <Route
            path="/moi_data_backup"
            element={
              <PrivateRoute>
                <DataBackup />
              </PrivateRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/complete/name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <CompletedPlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/mois_charts"
            element={
              <PrivateRoute>
                <ChartRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending/lists"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PendingListRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/completed/lists"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <CompleteListRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/mois_search"
            element={
              <PrivateRoute>
                <MoiSearchProvider>
                  <MoiSearchRelo />
                </MoiSearchProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/all_name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <PrivateRoute>
                <Loan />
              </PrivateRoute>
            }
          />

          <Route
            path="/new/loan"
            element={
              <PrivateRoute>
                <NewLoan />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_loan/:id"
            element={
              <PrivateRoute>
                <UpdateLoan />
              </PrivateRoute>
            }
          />

          <Route
            path="/name_group/loans"
            element={
              <PrivateRoute>
                <AllGroupLoan />
              </PrivateRoute>
            }
          />

          <Route
            path="/place_group/loans"
            element={
              <PrivateRoute>
                <PlaceGroupLoan />
              </PrivateRoute>
            }
          />
          <Route
            path="/all_place_group/mois"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/pending_place_group/mois"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PendingPlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/completed_place_group/mois"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <CompletedPlaceGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/given_status_group/mois"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <GivenStatusGroup />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/sample/nannu"
            element={
              <PrivateRoute>
                <NannuMoi />
              </PrivateRoute>
            }
          />
          <Route
            path="/update_user/:id"
            element={
              <PrivateRoute>
                <UpdateUser />
              </PrivateRoute>
            }
          />

          {/* Sample Pages */}

          <Route path="/sample" element={<Sample />} />
          <Route path="/addnew" element={<NewSample />} />
          <Route path="/update_sample/:id" element={<UpdateSample />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Catch-all route */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated() ? "/" : "/login"} />}
          />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
