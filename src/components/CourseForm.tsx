"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { FormInput, Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createCourseSchema } from "@/validators/course";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import SubscriptionAction from "./SubscriptionAction";
type Props = {
  isPro: boolean;
};

// z.infer<typeof formSchema> converts the Zod Object (formSchema) into
// a TS object
type FormInput = z.infer<typeof createCourseSchema>;
const CourseForm = ({ isPro }: Props) => {
  const router = useRouter(); //this router is from next/navigation. This is used to navigate in the app directory.
  const {
    mutate: submitCourse,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: async ({ title, units }: FormInput) => {
      const response = await axios.post("/api/course/createCourse", {
        title,
        units,
      });
      return response.data;
    },
    onSuccess: ({ courseId }) => {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      router.push(`/create/${courseId}`);
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "Uh-oh! Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { toast } = useToast();
  const form = useForm<FormInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  function onSubmitHandler({ title, units }: FormInput) {
    for (const unit of units) {
      if (unit === "") {
        toast({
          title: "Error",
          description: "Please fill in all the units.",
          variant: "destructive",
        });
        return;
      }
    }

    submitCourse({ title, units });
  }
  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="w-full mt-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col sm:flex-row items-start w-full sm:items-center">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input placeholder="Enter your course title" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <AnimatePresence>
            {form.watch("units").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                }}
              >
                <FormField
                  key={index}
                  control={form.control}
                  name={`units.${index}`} //special syntax
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row mt-2 sm:mt-1 items-start w-full sm:items-center">
                      <FormLabel className="flex-[1] text-xl">
                        Unit {index + 1}
                      </FormLabel>
                      <FormControl className="flex-[6]">
                        <Input placeholder="Enter a subtopic" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4">
              {/* To make it a normal btn add type attribute. If it isnt added, it will try to submit the form */}
              <Button
                type="button"
                variant={"secondary"}
                className="font-semibold"
                onClick={() => {
                  form.setValue("units", [...form.watch("units"), ""]); //appending to the units array
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 text-green-500 ml-2" />
              </Button>
              <Button
                type="button"
                variant={"secondary"}
                className="font-semibold ml-2"
                onClick={() => {
                  form.setValue("units", form.watch("units").slice(0, -1)); //removing from the units array
                }}
              >
                Remove Unit
                <Trash className="w-4 h-4 text-red-500 ml-2" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button
            className="w-full mt-6 rounded-lg "
            size={"lg"}
            type="submit"
            disabled={isLoading}
          >
            Create
          </Button>
        </form>
      </Form>

      {!isPro && <SubscriptionAction />}
    </div>
  );
};

export default CourseForm;

/**
 * () => {
 *  return (<div></div>)
 * }
 * is equivalent to
 * () => (<div></div>)
 */
