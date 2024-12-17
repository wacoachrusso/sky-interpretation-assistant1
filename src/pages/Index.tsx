import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationForm from "@/components/RegistrationForm";
import ContractInterpreter from "@/components/ContractInterpreter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-6 mb-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">SkyGuide</h1>
            <img
              src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
              alt="SkyGuide Logo"
              className="h-12"
            />
          </div>
        </div>
      </header>

      <main className="container">
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="interpret">Contract Interpreter</TabsTrigger>
          </TabsList>
          <div className="flex justify-center">
            <TabsContent value="register">
              <RegistrationForm />
            </TabsContent>
            <TabsContent value="interpret">
              <ContractInterpreter />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;