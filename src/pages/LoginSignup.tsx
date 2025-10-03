// src/pages/LoginSignup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";

interface FormData {
  fullName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  address: string;
  emergencyContact?: string;
  email?: string;
  department?: string;
  hospital?: string;
  licenseNumber?: string;
}

export default function LoginSignup() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isPatientRegOpen, setIsPatientRegOpen] = useState(false);
  const [isDoctorRegOpen, setIsDoctorRegOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "">("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: undefined,
    gender: "",
    address: "",
    emergencyContact: "",
    email: "",
    department: "",
    hospital: "",
    licenseNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request OTP from backend
  const handleGetOtp = async () => {
    setError(null);
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      // example: POST /auth/request-otp { phone: '1234567890' }
      await API.post("/auth/request-otp", { phone: phoneNumber });
      // server may return { ok: true } or nothing; open OTP dialog regardless
      setIsOtpOpen(true);
    } catch (err: any) {
      console.error("request-otp error:", err);
      setError(err?.response?.data?.error || err?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP with backend; on success, server may return JWT
  const handleVerifyOtp = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      // example: POST /auth/verify-otp { phone, otp }
      const res = await API.post("/auth/verify-otp", { phone: phoneNumber, otp });
      const token = res?.data?.token ?? res?.data?.accessToken ?? null;
      const role = res?.data?.role ?? null; // backend may return role
      if (token) {
        localStorage.setItem("token", token);
      }
      // close OTP dialog
      setIsOtpOpen(false);
      setOtp("");
      // if backend returned role, navigate accordingly
      if (role === "doctor") {
        navigate("/doctor-dashboard");
        return;
      } else if (role === "patient") {
        navigate("/patient-dashboard");
        return;
      }
      // otherwise open role selection
      setIsRoleOpen(true);
    } catch (err: any) {
      console.error("verify-otp error:", err);
      setError(err?.response?.data?.error || err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (role: "patient" | "doctor") => {
    setSelectedRole(role);
    setIsRoleOpen(false);
    if (role === "patient") {
      setIsPatientRegOpen(true);
    } else {
      setIsDoctorRegOpen(true);
    }
  };

  // Register patient via backend API
  const handlePatientRegistration = async () => {
    setError(null);
    if (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.address) {
      setError("Please fill all required patient fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        gender: formData.gender,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        email: formData.email,
        phone: phoneNumber
      };
      // example endpoint: POST /patients
      const res = await API.post("/patients", payload);
      // if backend returns token on registration, save and navigate
      const token = res?.data?.token ?? null;
      if (token) {
        localStorage.setItem("token", token);
      }
      setIsPatientRegOpen(false);
      setConfirmationMessage("Account created — pending verification. You can continue to the dashboard as a guest.");
      setIsConfirmationOpen(true);
    } catch (err: any) {
      console.error("patient registration error:", err);
      setError(err?.response?.data?.error || err?.message || "Patient registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Register doctor via backend API
  const handleDoctorRegistration = async () => {
    setError(null);
    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.address ||
      !formData.department ||
      !formData.hospital ||
      !formData.licenseNumber
    ) {
      setError("Please fill all required doctor fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        gender: formData.gender,
        address: formData.address,
        department: formData.department,
        hospital: formData.hospital,
        licenseNumber: formData.licenseNumber,
        email: formData.email,
        phone: phoneNumber
      };
      // example endpoint: POST /doctors
      const res = await API.post("/doctors", payload);
      const token = res?.data?.token ?? null;
      if (token) {
        localStorage.setItem("token", token);
      }
      setIsDoctorRegOpen(false);
      setConfirmationMessage("Application submitted — pending verification. You can continue to the dashboard as a guest.");
      setIsConfirmationOpen(true);
    } catch (err: any) {
      console.error("doctor registration error:", err);
      setError(err?.response?.data?.error || err?.message || "Doctor registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPatient = () => {
    // Navigate to patient dashboard with demo data
    navigate("/patient-dashboard", {
      state: {
        user: {
          name: "Aman Singh",
          dob: "12/03/1998",
          gender: "Male",
          address: "Nabha, Punjab",
          phone: "1234567890"
        }
      }
    });
  };

  const handleDemoDoctor = () => {
    // Navigate to doctor dashboard with demo data
    navigate("/doctor-dashboard", {
      state: {
        user: {
          name: "Dr. Meera Sharma",
          dob: "05/07/1985",
          gender: "Female",
          department: "General Medicine",
          hospital: "Nabha Civil Hospital",
          licenseNo: "DOC12345",
          phone: "0000000000"
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      dateOfBirth: undefined,
      gender: "",
      address: "",
      emergencyContact: "",
      email: "",
      department: "",
      hospital: "",
      licenseNumber: ""
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo={true}
        hideLoginButton={true}
      />

      <div className="flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-lg bg-white rounded-xl shadow-lg">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="NabhaSehatMitr Logo" className="h-16 w-16 object-cover rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to NABHASEHATMITR</h1>
            <p className="text-gray-600">Enter your phone number to continue</p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex mt-2">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                    <span className="text-sm text-gray-600">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 rounded-l-none border-l-0"
                  />
                </div>
                {phoneNumber && phoneNumber.length !== 10 && (
                  <p className="text-sm text-red-600 mt-1">Please enter exactly 10 digits</p>
                )}
              </div>

              <div>
                <Button
                  onClick={handleGetOtp}
                  disabled={phoneNumber.length !== 10 || loading}
                  className="w-full bg-[#14213D] hover:bg-[#14213D]/90 text-white"
                >
                  {loading ? "Please wait..." : "Get OTP"}
                </Button>
              </div>

              {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-gray-500 text-center">Demo Accounts:</p>
              <Button variant="outline" onClick={handleDemoPatient} className="w-full text-sm">
                Demo: Login as Patient (1234567890)
              </Button>
              <Button variant="outline" onClick={handleDemoDoctor} className="w-full text-sm">
                Demo: Login as Doctor (0000000000)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OTP Dialog */}
        <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Enter 6-digit OTP (demo: any OTP works)</p>
              <Input
                type="tel"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-xl tracking-widest"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || loading}
                  className="flex-1 bg-[#14213D] hover:bg-[#14213D]/90"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                <Button variant="outline" onClick={() => setIsOtpOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Role Selection Dialog */}
        <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Your Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button onClick={() => handleRoleSelection("patient")} className="w-full bg-[#14213D] hover:bg-[#14213D]/90">
                I am a Patient
              </Button>
              <Button onClick={() => handleRoleSelection("doctor")} variant="outline" className="w-full">
                I am a Doctor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient Registration Dialog */}
        <Dialog
          open={isPatientRegOpen}
          onOpenChange={(open) => {
            setIsPatientRegOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Registration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="p-3 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handlePatientRegistration}
                disabled={!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.address || loading}
                className="w-full bg-[#14213D] hover:bg-[#14213D]/90"
              >
                {loading ? "Submitting..." : "Create Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Doctor Registration Dialog */}
        <Dialog
          open={isDoctorRegOpen}
          onOpenChange={(open) => {
            setIsDoctorRegOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Doctor Registration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="p-3 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hospital">Current Hospital *</Label>
                <Input
                  id="hospital"
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleDoctorRegistration}
                disabled={
                  !formData.fullName ||
                  !formData.dateOfBirth ||
                  !formData.gender ||
                  !formData.address ||
                  !formData.department ||
                  !formData.hospital ||
                  !formData.licenseNumber ||
                  loading
                }
                className="w-full bg-[#14213D] hover:bg-[#14213D]/90"
              >
                {loading ? "Submitting..." : "Apply as Doctor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registration Complete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{confirmationMessage}</p>
              <Button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  navigate("/");
                }}
                className="w-full bg-[#14213D] hover:bg-[#14213D]/90"
              >
                Continue to Dashboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
