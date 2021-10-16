import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </FormControl>
        {errors}
        <Button colorScheme="blue" type="submit">
          Signup
        </Button>
      </form>
    </div>
  );
}

export default signup;
