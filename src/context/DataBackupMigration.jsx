import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useContext,
} from "react";
import useData from "../components/custom-hook/useData";
import { useNavigate } from "react-router-dom";

export const MoiContext = createContext();

export const DataBackupMigration = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <MoiContext.Provider
      value={{
        loggedInUser,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};
