import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abi from "../src/abi.json"
import "./App.css";

const CONTRACT_ADDRESS = "0x8076855D2dC2FEb3f11F505417b1ae6f8ECe46aa";
const ABI = abi

export default function ClassRegistration() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then((signer) => {
        setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
        checkWalletConnection();
      });
    } else {
      toast.error("Please install MetaMask.");
    }
  }, []);

  const checkWalletConnection = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      fetchStudents()
    } else {
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      toast.success("Wallet connected!");
      fetchStudents()
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet.");
    }
  };

  const fetchStudents = async () => {
    if (contract) {
      try {
        const studentData = await contract.getAllStudents();
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students.");
      }
    }
  };

  const registerStudent = async () => {
    if (contract) {
      try {
        const tx = await contract.registerStudent(studentId, studentName);
        await tx.wait();
        toast.success("Student registered successfully!");
        fetchStudents(); // Refresh students list after registration
      } catch (error) {
        console.error("Error registering student:", error);
        setShowModal(true); // Show modal on error
      }
    }
  };

  const removeStudent = async (id) => {
    if (contract) {
      try {
        const tx = await contract.removeStudent(id);
        await tx.wait();
        toast.success("Student removed successfully!");
        fetchStudents(); // Refresh students list after removal
      } catch (error) {
        console.error("Error removing student:", error);
        setShowModal(true); // Show modal on error
      }
    }
  };

  const getStudentById = async () => {
    if (contract && searchId) {
      try {
        const student = await contract.getStudent(searchId);

        console.log('Raw student data:', student); // Debugging
    
        // If the contract returns an array instead of an object, destructure it correctly
        const [name, id] = student; 
  
        // Ensure proper formatting
        setSearchResult({
          id:id.toString(),
          name:name,
        });
  
        toast.success("Student found!");
        
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Failed to fetch student details");
        setSearchResult(null);
      }
    } else if (!searchId) {
      toast.info("Please enter a student ID");
    }
  };

  return (
    <div className="container">
      <h2>Class Registration System</h2>

      {!isConnected ? (
        <button onClick={connectWallet} className="bg-green">
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}

      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <button onClick={registerStudent} className="bg-blue">
        Register
      </button>

      <div className="search-section">
        <h3>Search Student</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter Student ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={getStudentById} className="bg-blue">
            Search
          </button>
        </div>
        
        {searchResult && (
          <div className="search-result">
            <h4>Search Result:</h4>
            <div className="student-card">
              <p><strong>ID:</strong> {searchResult.id}</p>
              <p><strong>Name:</strong> {searchResult.name}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3>Registered Students</h3>
        <ul>
          {students.length === 0 ? (
            <li>No students registered yet.</li>
          ) : (
            students.map((student) => {
              console.log('Student data:', student); // Debug log
              return (
                <li key={student.studentId.toString()}>
                  <div>
                    <strong>{student.name}</strong> (ID: {student.studentId.toString()})
                  </div>
                  <button onClick={() => removeStudent(student.studentId)}>
                    Remove
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Something went wrong!</h3>
            </div>
            <div className="modal-footer">
              <button className="close" onClick={() => setShowModal(false)}>
                X
              </button>
              <p>We encountered an error. Please try again.</p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}