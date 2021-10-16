import React, { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

function signout() {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>signing you out ...</div>;
}

export default signout;
