import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";
import { LoadingPage } from "~/components/loading";
import { generateSsgHelper } from "~/server/helpers";

dayjs.extend(relativeTime);

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId });
  if (isLoading) return <LoadingPage size={64} />;
  if (!data || data.length === 0) return <div>No posts yet!</div>;
  return (
    <div className="flex flex-col gap-4">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>Not found</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36  border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt="Profile Image"
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data?.username}`}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSsgHelper();

  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("Invalid slug");
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
