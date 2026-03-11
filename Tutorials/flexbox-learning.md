# Flexbox Learning

## Goal

Learn beginner-friendly layout and styling with Tailwind first and core CSS second.

We use this example:

```tsx
<div class="flex min-h-[60vh] flex-col items-center justify-center gap-8">
  <h1 class="text-center text-2xl font-bold">Choose your Role!</h1>

  <div class="flex items-center justify-center gap-6">
    <A
      class="inline-flex items-center justify-center rounded-xl border border-red-600 px-6 py-4 text-lg font-semibold text-red-600 no-underline"
      href="/secure/player"
    >
      Player
    </A>

    <A
      class="inline-flex items-center justify-center rounded-xl border border-blue-600 px-6 py-4 text-lg font-semibold text-blue-600 no-underline"
      href="/secure/game-master"
    >
      Game-Master
    </A>
  </div>
</div>
```

## What This Layout Does

- puts the title above the links
- centers the whole block on the page
- places the two links next to each other
- styles the links so they look like buttons

## Tailwind First

### Outer container

```tsx
<div class="flex min-h-[60vh] flex-col items-center justify-center gap-8">
```

- `flex` - turns the `div` into a flexbox container
- `min-h-[60vh]` - gives the container a minimum height of 60% of the screen height
- `flex-col` - stacks children from top to bottom
- `items-center` - centers children horizontally
- `justify-center` - centers children vertically
- `gap-8` - adds space between the heading and the links row

### Heading

```tsx
<h1 class="text-center text-2xl font-bold">Choose your Role!</h1>
```

- `text-center` - centers the heading text
- `text-2xl` - makes the text larger
- `font-bold` - makes the text bold

### Inner row

```tsx
<div class="flex items-center justify-center gap-6">
```

- `flex` - puts the direct children in one row
- `items-center` - aligns the links nicely on the cross axis
- `justify-center` - centers the full row
- `gap-6` - adds space between the two links

### Player link

```tsx
<A
  class="inline-flex items-center justify-center rounded-xl border border-red-600 px-6 py-4 text-lg font-semibold text-red-600 no-underline"
  href="/secure/player"
>
  Player
</A>
```

- `inline-flex` - makes the link behave like a small flex container
- `items-center` - centers text vertically inside the link
- `justify-center` - centers text horizontally inside the link
- `rounded-xl` - gives rounded corners
- `border` - adds a border
- `border-red-600` - makes the border red
- `px-6` - adds horizontal padding
- `py-4` - adds vertical padding
- `text-lg` - makes the text bigger
- `font-semibold` - makes the text medium-bold
- `text-red-600` - makes the text red
- `no-underline` - removes the default underline

### Game-Master link

```tsx
<A
  class="inline-flex items-center justify-center rounded-xl border border-blue-600 px-6 py-4 text-lg font-semibold text-blue-600 no-underline"
  href="/secure/game-master"
>
  Game-Master
</A>
```

This is the same as the player link, except:

- `border-blue-600` - makes the border blue
- `text-blue-600` - makes the text blue

## Core CSS Second

This is the same idea written in plain CSS.

```css
.page {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.role-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.role-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
}

.player {
  color: #dc2626;
  border-color: #dc2626;
}

.game-master {
  color: #2563eb;
  border-color: #2563eb;
}
```

## Flexbox Rule Of Thumb

When you use `flex-col`:

- `justify-center` centers up and down
- `items-center` centers left and right

When you use normal `flex` row:

- `justify-center` centers left and right
- `items-center` centers up and down

This is the most common beginner confusion.

## A Tag Vs Button

- use `<A>` when the user moves to another route
- use `<button>` when the user triggers an action on the same page

In this page, role choices should stay `<A>` tags because they navigate.

## Simple Learning Order

1. Understand the outer container
2. Understand the inner row
3. Understand one link style
4. Change one class at a time
5. Only then add hover or responsive classes

## Tiny Practice Tasks

- change `gap-8` to `gap-2`
- change `gap-6` to `gap-10`
- change `flex-col` to `flex-row` on the outer container
- try background colors instead of border-only links
- add a simple hover style later

## Quick Reading Trick

When you see a Tailwind class list, read it in this order:

1. layout
2. size
3. direction
4. alignment
5. spacing
6. border and color
7. text styling
