export const extractIdFromGid = (gid) => {
  try {
    const [id] = gid.split("/")?.slice(-1);
    return id;
  } catch (error) {
    console.log("🚀  ~ error:", error);
    throw new Error("Invalid GID");
  }
};
