

## Update Colorwork Portfolio Card Image

Replace the current Colorwork portfolio thumbnail with the uploaded vibrant color tattoo artwork, which better represents bold colorwork versus the current fineline-looking image.

### Changes

1. **Copy the uploaded image into the project**
   - Copy `user-uploads://IMG_6605.jpeg` to `src/assets/colorwork-portfolio.jpg`

2. **Update `src/components/Portfolio.tsx`**
   - Import the new image: `import colorworkImage from "@/assets/colorwork-portfolio.jpg"`
   - Replace `portfolio2` with `colorworkImage` in the Colorwork portfolio item
   - The border styling already matches the other cards (all use the same `card-glow` class and hover border effect), so no border changes are needed

