import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logo.jpg";
interface Report {
  id: string;
  patientName: string;
  viewUrl: string;
  downloadUrl: string;
}
const reports: Report[] = [{
  id: "1",
  patientName: "Prerna Oberoi",
  viewUrl: "https://drive.google.com/file/d/1wvtVwtgX9CeEiGT1KTB0p_t9RIDbNjUE/view?usp=share_link",
  downloadUrl: "https://drive.google.com/uc?export=download&id=1wvtVwtgX9CeEiGT1KTB0p_t9RIDbNjUE"
}, {
  id: "2",
  patientName: "Ramesh Singh",
  viewUrl: "https://drive.google.com/file/d/1W4fF2FrAgeIeweAbFy7vJTwLLULp68wf/view?usp=sharing",
  downloadUrl: "https://drive.google.com/uc?export=download&id=1W4fF2FrAgeIeweAbFy7vJTwLLULp68wf"
}, {
  id: "3",
  patientName: "Ravi Kumar",
  viewUrl: "https://drive.google.com/file/d/1ij9b-61dZOmis6NdDNuQuvKLxqJ31TzD/view?usp=sharing",
  downloadUrl: "https://drive.google.com/uc?export=download&id=1ij9b-61dZOmis6NdDNuQuvKLxqJ31TzD"
}, {
  id: "4",
  patientName: "Simran Kaur",
  viewUrl: "https://drive.google.com/file/d/1kHJHlEPlxrfJQpAvtLBc4leOBGRdKSzb/view?usp=sharing",
  downloadUrl: "https://drive.google.com/uc?export=download&id=1kHJHlEPlxrfJQpAvtLBc4leOBGRdKSzb"
}];
const handleViewReport = (report: Report) => {
  window.open(report.viewUrl, '_blank');
};
const handleDownloadReport = (report: Report) => {
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = report.downloadUrl;
  link.download = `${report.patientName}_Report.pdf`;
  link.target = '_blank';

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export default function Reports() {
  const {
    currentLanguage,
    changeLanguage
  } = useLanguage();
  return <div className="min-h-screen bg-reports-cream font-poppins">
      {/* Subtle gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-healthcare-green/10 to-transparent pointer-events-none"></div>
      
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} showCenterLogo={true} />

      <main className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* Page Heading with 3-color style and underline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-poppins mb-4 text-primary">
              Reports
            </h1>
            <div className="w-24 h-1 bg-healthcare-green/60 mx-auto rounded-full"></div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {reports.map(report => <Card key={report.id} className="bg-reports-card border-reports-card-border border-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8">
                <CardContent className="p-0 space-y-6">
                  {/* Report Name with Document Icon */}
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold font-poppins text-primary text-center">
                      {report.patientName}
                    </h3>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 justify-center pt-4">
                    <Button onClick={() => handleViewReport(report)} className="bg-reports-view hover:bg-reports-view/90 text-white px-8 py-3 rounded-full font-medium font-poppins flex-1 max-w-[140px] transition-all duration-300 hover:shadow-lg hover:shadow-healthcare-green/25 transform hover:-translate-y-0.5" aria-label={`View report for ${report.patientName}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button onClick={() => handleDownloadReport(report)} className="bg-reports-download hover:bg-reports-download/90 text-white px-8 py-3 rounded-full font-medium font-poppins flex-1 max-w-[140px] transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5" aria-label={`Download report for ${report.patientName}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Nabha Sehat Mitr" className="h-10 w-10 object-contain" />
                <h3 className="text-xl font-bold">
                  <span className="text-primary">Nabha</span>
                  <span className="text-healthcare-green">Sehat</span>
                  <span className="text-medical-red">Mitr</span>
                </h3>
              </div>
              <p className="text-sm text-black leading-relaxed">
                Your trusted healthcare companion in Nabha and Punjab. Find doctors, access emergency services, and manage your health records - all in one place.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  About Us
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Terms & Conditions
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Help & Support
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-black">+91 8800852822, +91 9899489078</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-black">daamn32322@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-black">Chennai, Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-muted-foreground/20 mt-12 pt-8">
            <div className="text-center text-sm text-black">
              <p>&copy; 2025 HealthConnect. All rights reserved. | Providing quality healthcare services.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}