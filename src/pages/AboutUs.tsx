import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const developers = [
  {
    name: "Developer 1",
    role: "Frontend Specialist",
    description: "Specializes in frontend design, making the app simple and intuitive."
  },
  {
    name: "Developer 2",
    role: "Backend Expert",
    description: "Expert in backend systems, ensuring security and smooth performance."
  },
  {
    name: "Developer 3",
    role: "UX/UI Designer",
    description: "Focused on UI/UX for an accessible and patient-friendly experience."
  },
  {
    name: "Developer 4",
    role: "Integration Specialist",
    description: "Works on integrations and features like reports and calendar management."
  }
];

const AboutUs = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo
      />

      <main className="container mx-auto px-4 py-12">
        {/* About Us Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-primary">About Us</h1>
            <p className="text-lg leading-relaxed text-foreground">
              At <span className="font-semibold text-primary">HealthConnect</span>, our mission is to make quality healthcare accessible, convenient, and patient-friendly. We provide a trusted platform where patients can easily book appointments, access lab reports, and connect with doctors, while healthcare professionals can manage their schedules and offer better care. We believe in combining technology with compassion, ensuring that every patient receives timely support and reliable medical services.
            </p>
          </div>
        </section>

        {/* Developers Section */}
        <section>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Our Developers</h2>
              </div>
              <p className="text-muted-foreground">
                Meet the talented team behind HealthConnect
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {developers.map((developer, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Image Placeholder */}
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-healthcare-green flex items-center justify-center mb-4">
                        <Users className="h-16 w-16 text-white" />
                      </div>
                      
                      {/* Developer Info */}
                      <h3 className="text-xl font-semibold mb-2">{developer.name}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{developer.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {developer.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-healthcare-green/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
              <p className="text-lg leading-relaxed">
                We are dedicated to revolutionizing healthcare delivery through innovative technology, making it easier for patients and healthcare providers to connect and collaborate for better health outcomes.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;