import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

interface RatingStarsProps {
  ratingValue: number;
}

export default function RatingStars({ ratingValue }: RatingStarsProps) {
  // Hook para detectar se está em tela md ou maior
  const [isMd, setIsMd] = React.useState(false);

  React.useEffect(() => {
    const checkScreen = () => setIsMd(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
      <Rating
        name="text-feedback"
        value={ratingValue}
        readOnly
        precision={0.5}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        size={isMd ? "medium" : "small"}
        sx={{
          color: "#34D399",
          "& .MuiRating-iconEmpty": {
            color: "#B0B0B0",
          },
        }}
      />
    </Box>
  );
}