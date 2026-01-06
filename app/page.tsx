import PhotoUploadForm from "@/components/PhotoUploadForm";
import TrainingRecordList from "@/components/TrainingRecordList";
import MotivationBanner from "@/components/MotivationBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30">
      <main className="py-8">
        <PhotoUploadForm />
        <div className="mt-16 border-t border-orange-200/50 pt-16">
          <TrainingRecordList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
