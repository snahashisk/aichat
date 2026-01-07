import { OTPForm } from "@/components/otp-form";
import { BackgroundLines } from "@/components/ui/background-lines";

const verifyPage = async ({
  params,
}: {
  params: Promise<{ userid: string }>;
}) => {
  const { userid } = await params;

  return (
    <div className="flex min-h-svh w-full">
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-xs">
          <OTPForm userId={userid} />
        </div>
      </div>
      <div className="relative hidden w-1/2 lg:block">
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
          <h2 className="bg-clip-text text-transparent text-center bg-linear-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Smart AI Chatbot Platform <br /> Built on Cloud
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            Access intelligent, secure, and scalable AI-powered conversations.
            Get instant assistance, automation, and insights powered by modern
            cloud architecture — all in one place.
          </p>
        </BackgroundLines>
      </div>
    </div>
  );
};

export default verifyPage;
