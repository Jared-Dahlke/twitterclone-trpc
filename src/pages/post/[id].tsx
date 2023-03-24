import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api, RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);

const SinglePostPage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400  md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4"></div>
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;
