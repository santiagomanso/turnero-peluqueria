import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  date: z.date({
    message: "Please select a date for your appointment.",
  }),
});

type FormType = z.infer<typeof formSchema>;

export default function useAppointmentForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date(),
    }, // Remove defaultValues entirely or set it like this:
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormType)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["date"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormType) => {
    console.log("Form submitted:", data);
  };

  return {
    form,
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    onSubmit,
  };
}
