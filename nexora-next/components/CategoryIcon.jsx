"use client";

import {
  Camera,
  Cpu,
  Gamepad2,
  Headphones,
  Laptop,
  LayoutGrid,
  Router,
  Smartphone,
  Sofa,
  Tv,
  Watch,
} from "lucide-react";

const MAP = {
  smartphone: Smartphone,
  laptop: Laptop,
  cpu: Cpu,
  headphones: Headphones,
  watch: Watch,
  "gamepad-2": Gamepad2,
  camera: Camera,
  tv: Tv,
  home: Sofa,
  router: Router,
};

export default function CategoryIcon({ icon, size = 20, ...props }) {
  const Icon = MAP[icon] || LayoutGrid;
  return <Icon size={size} {...props} />;
}
