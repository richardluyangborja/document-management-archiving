"use client";

import Logo from "../../public/logo.jpg";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { loginAction } from "./login-actions";
import { useActionState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 w-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={action} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Document Management Archiving
                </h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              {state?.message && (
                <Alert variant="destructive">
                  <InfoIcon />
                  <AlertTitle>Login failed!</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <Field data-invalid={state?.errors?.email ? true : false}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  aria-invalid={state?.errors?.email ? true : false}
                />
                {state?.errors?.email && <p>{state.errors.email}</p>}
              </Field>
              <Field data-invalid={state?.errors?.password ? true : false}>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    aria-invalid={state?.errors?.password ? true : false}
                  >
                    Password
                  </FieldLabel>
                </div>
                <Input id="password" type="password" name="password" />
                {state?.errors?.password && <p>{state.errors.password}</p>}
              </Field>
              <Field>
                {pending ? (
                  <Button type="submit" disabled>
                    Loading
                    <Spinner data-icon="inline-start" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={pending}>
                    Login
                  </Button>
                )}
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={Logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
