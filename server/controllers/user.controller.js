import sql from "../config/Db.js"

export const getUserCreations = async (req, res) => {


    try {

        const { userId } = req.auth();
        const creations = await sql` SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        res.json({
            success: true,
            creations
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }
}


export const getPublishedCreations = async (req, res) => {

    try {


        const creations = await sql` SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

        res.json({
            success: true,
            creations
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }
}

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    if (!id) {
      return res.json({ success: false, message: "Creation ID is required" });
    }

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIDStr = userId.toString();

    let updatedLikes, message;
    if (currentLikes.includes(userIDStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIDStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIDStr];
      message = "Creation Liked";
    }

    // ✅ Convert JS array to Postgres text[]
    const arrayLiteral = `{${updatedLikes.join(',')}}`;

    await sql`
      UPDATE creations
      SET likes = ${arrayLiteral}::text[]
      WHERE id = ${id}
    `;

    return res.json({ success: true, message });
  } catch (error) {
    console.error("Toggle Like Error:", error);
    return res.json({ success: false, message: error.message });
  }
};
