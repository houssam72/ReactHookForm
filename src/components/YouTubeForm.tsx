import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";

let renderCount = 0;

type FormValues = {
  userName: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      userName: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    // mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      submitCount,
    },
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;

  console.log("Toued and dirty", touchedFields, dirtyFields, isDirty);
  console.log(
    "Submit",
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount
  );
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  // useEffect((): any => {
  //   const subscription = watch((value) => {
  //     console.log("Watch", value);
  //   });
  //   return () => subscription.unsubscribe;
  // }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  const handleGetValues = () => {
    console.log("Get values", getValues(["userName", "email"]));
  };

  const handleSetValues = () => {
    setValue("userName", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  renderCount++;
  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="userName"
            {...register("userName", {
              required: "Username is required",
            })}
          />
          <p className="error">{errors.userName?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^(?!\s*$)(^\S+@\S+\.\S+$)$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email adreess"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvialable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length == 0 || "Email already exists";
                },
              },
            })}
          />

          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: {
                value: true,
                message: "Channel is required",
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="Twitter">twitter</label>
          <input
            type="text"
            {...register("social.twitter", {
              disabled: true,
              required: "Enter twitter profile",
            })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="facebook">facebook</label>
          <input type="text" {...register("social.facebook")} />
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary phone number</label>
          <input type="text" {...register("phoneNumbers.0")} />
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone number</label>
          <input type="text" {...register("phoneNumbers.1")} />
        </div>
        <div className="form-control">
          <label htmlFor="phoneNumbers">List of phone numbers</label>
          {fields.map((field, index) => {
            return (
              <div className="form-control">
                <input
                  type="text"
                  {...register(`phNumbers.${index}.number` as const)}
                />
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            );
          })}
          <button type="button" onClick={() => append({ number: "" })}>
            Add phone number
          </button>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date is required",
              },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>

        <button
        disabled={!isValid}
        >
          Submit
        </button>
        <button type="button" onClick={handleGetValues}>
          Get values
        </button>
        <button type="button" onClick={handleSetValues}>
          Set values
        </button>
        <button type="button" onClick={() => trigger()}>
          Trigger All
        </button>
        <button type="button" onClick={() => trigger("channel")}>
          Trigger channel
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
