import type { Category, CategoryInput } from "@/features/categories/domain/category";
import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import type { CreateOrderInput, Order, OrderStatus } from "@/features/orders/domain/order";
import type { Product, ProductFilters, ProductInput } from "@/features/products/domain/product";
import type { User } from "@/features/auth/domain/user";

const STORAGE_KEY = "respawn_demo_db_v1";

interface DemoAccount {
  user: User;
  password: string;
}

interface DemoDb {
  categories: Category[];
  products: Product[];
  orders: Order[];
  accounts?: DemoAccount[];
}

function makePosterDataUri(title: string, subtitle: string, bg: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <rect width="640" height="480" rx="36" fill="${bg}"/>
    <circle cx="520" cy="110" r="140" fill="${accent}" opacity="0.28"/>
    <circle cx="120" cy="390" r="160" fill="#ffffff" opacity="0.12"/>
    <rect x="44" y="44" width="148" height="40" rx="20" fill="#17142b"/>
    <text x="118" y="70" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#f4efe6">${subtitle}</text>
    <text x="48" y="340" font-family="sans-serif" font-weight="900" font-size="40" fill="#17142b">${title}</text>
    <rect x="48" y="364" width="140" height="10" rx="5" fill="${accent}"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Videojuegos",
    description: "Ediciones físicas y de colección para todas las plataformas.",
  },
  {
    id: 2,
    name: "Consolas",
    description: "Consolas de sobremesa, portátiles y ediciones especiales.",
  },
  {
    id: 3,
    name: "Accesorios",
    description: "Controles pro, audífonos inalámbricos, bases de carga y estuches.",
  },
  {
    id: 4,
    name: "Personajes y Figuras",
    description: "Estatuillas coleccionables, amiibo y réplicas oficiales.",
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "The Legend of Zelda: Echoes of Wisdom",
    description:
      "Acompaña a la princesa Zelda en una aventura inédita por Hyrule usando el cetro Tri para crear ecos y resolver acertijos.",
    price: 239900,
    stock: 14,
    platform: "SWITCH",
    imageUrl: makePosterDataUri("Zelda: Echoes", "SWITCH", "#c8f169", "#ff5b3a"),
    categoryId: 1,
    category: { id: 1, name: "Videojuegos" },
  },
  {
    id: 102,
    name: "PlayStation 5 Slim Edición Disco 1TB",
    description:
      "Consola PS5 de diseño compacto con SSD ultrarrápido de 1 TB, control inalámbrico DualSense y lector Blu-ray.",
    price: 2499000,
    stock: 6,
    platform: "PS5",
    imageUrl: makePosterDataUri("PS5 Slim 1TB", "PS5", "#59c3ff", "#7b5cff"),
    categoryId: 2,
    category: { id: 2, name: "Consolas" },
  },
  {
    id: 103,
    name: "Control DualSense Edición Astro Bot",
    description:
      "Mando inalámbrico de edición limitada con detalles azules inspirados en Astro, respuesta háptica y gatillos adaptativos.",
    price: 389900,
    stock: 3,
    platform: "PS5",
    imageUrl: makePosterDataUri("DualSense Astro", "ACCESORIO", "#ffc93c", "#ff5b3a"),
    categoryId: 3,
    category: { id: 3, name: "Accesorios" },
  },
  {
    id: 104,
    name: "Figura Malenia, Espada de Miquella (24 cm)",
    description:
      "Estatuilla coleccionable de PVC pintada a mano con base temática de Elden Ring y armadura dorada detallada.",
    price: 319000,
    stock: 8,
    platform: "MULTI",
    imageUrl: makePosterDataUri("Malenia 24cm", "FIGURA", "#ff5b3a", "#ffc93c"),
    categoryId: 4,
    category: { id: 4, name: "Personajes y Figuras" },
  },
  {
    id: 105,
    name: "Elden Ring: Shadow of the Erdtree Edition",
    description:
      "Incluye el juego base galardonado y la expansión completa en la Tierra Umbría con nuevos jefes, armas y hechizos.",
    price: 279900,
    stock: 11,
    platform: "XBOX",
    imageUrl: makePosterDataUri("Elden Ring", "XBOX", "#c8f169", "#7b5cff"),
    categoryId: 1,
    category: { id: 1, name: "Videojuegos" },
  },
  {
    id: 106,
    name: "Audífonos Razer BlackShark V2 HyperSpeed",
    description:
      "Audio espacial THX, micrófono de banda ancha plegable y batería de hasta 70 horas para sesiones competitivas en PC y consola.",
    price: 529000,
    stock: 9,
    platform: "PC",
    imageUrl: makePosterDataUri("BlackShark V2", "PC AUDIO", "#59c3ff", "#17142b"),
    categoryId: 3,
    category: { id: 3, name: "Accesorios" },
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 5001,
    userId: 2,
    productId: 101,
    quantity: 1,
    total: 239900,
    status: "PENDING",
    shippingAddress: "Cra 43A # 14-50, El Poblado, Medellín",
    createdAt: "2026-11-07T15:30:00.000Z",
    user: { id: 2, name: "Jugador Demo", email: "user@respawn.com" },
    product: {
      id: 101,
      name: "The Legend of Zelda: Echoes of Wisdom",
      imageUrl: INITIAL_PRODUCTS[0].imageUrl,
      platform: "SWITCH",
    },
  },
  {
    id: 5002,
    userId: 2,
    productId: 104,
    quantity: 2,
    total: 638000,
    status: "SHIPPED",
    shippingAddress: "Calle 10 # 32-18, Laureles, Medellín",
    createdAt: "2026-11-06T11:15:00.000Z",
    user: { id: 2, name: "Jugador Demo", email: "user@respawn.com" },
    product: {
      id: 104,
      name: "Figura Malenia, Espada de Miquella (24 cm)",
      imageUrl: INITIAL_PRODUCTS[3].imageUrl,
      platform: "MULTI",
    },
  },
];

function loadDb(): DemoDb {
  if (typeof window === "undefined") {
    return {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
    };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DemoDb;
    } catch {
      // Si el JSON guardado falla, restaurar el estado inicial
    }
  }
  const initial: DemoDb = {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveDb(db: DemoDb): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export const DEMO_USERS: Record<"ADMIN" | "USER", User> = {
  ADMIN: {
    id: 1,
    name: "Admin Respawn",
    email: "admin@respawn.com",
    role: "ADMIN",
  },
  USER: {
    id: 2,
    name: "Camila Gómez",
    email: "user@respawn.com",
    role: "USER",
  },
};

const INITIAL_ACCOUNTS: DemoAccount[] = [
  { user: DEMO_USERS.ADMIN, password: "Admin123!" },
  { user: DEMO_USERS.USER, password: "User123!" },
];

function getAccounts(db: DemoDb): DemoAccount[] {
  return db.accounts && db.accounts.length > 0 ? db.accounts : INITIAL_ACCOUNTS;
}

export const demoStore = {
  authenticateUser(email: string, password: string): User {
    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    const account = getAccounts(db).find((item) => item.user.email.toLowerCase() === normalizedEmail);
    if (!account || account.password !== password) {
      throw new Error("AUTH_INVALID");
    }
    return account.user;
  },

  registerUser(name: string, email: string, password: string): User {
    const db = loadDb();
    const accounts = getAccounts(db);
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((item) => item.user.email.toLowerCase() === normalizedEmail)) {
      throw new Error("AUTH_DUPLICATE");
    }
    const newUser: User = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: "USER",
    };
    db.accounts = [...accounts, { user: newUser, password }];
    saveDb(db);
    return newUser;
  },

  listCategories(): Category[] {
    return loadDb().categories;
  },

  createCategory(input: CategoryInput): Category {
    const db = loadDb();
    const created: Category = {
      id: Date.now(),
      name: input.name,
      description: input.description,
    };
    db.categories = [created, ...db.categories];
    saveDb(db);
    return created;
  },

  updateCategory(id: EntityId, input: CategoryInput): Category {
    const db = loadDb();
    let updated: Category = { id, name: input.name, description: input.description };
    db.categories = db.categories.map((cat) => {
      if (String(cat.id) === String(id)) {
        updated = { ...cat, name: input.name, description: input.description };
        return updated;
      }
      return cat;
    });
    saveDb(db);
    return updated;
  },

  removeCategory(id: EntityId): void {
    const db = loadDb();
    db.categories = db.categories.filter((cat) => String(cat.id) !== String(id));
    saveDb(db);
  },

  listProducts(filters: ProductFilters): PaginatedResponse<Product> {
    const db = loadDb();
    const search = filters.search.trim().toLowerCase();
    const filtered = db.products.filter((product) => {
      if (search && !`${product.name} ${product.description}`.toLowerCase().includes(search)) {
        return false;
      }
      if (filters.categoryId && String(product.categoryId) !== String(filters.categoryId)) {
        return false;
      }
      if (filters.platform && product.platform !== filters.platform) {
        return false;
      }
      if (filters.minPrice && Number(product.price) < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && Number(product.price) > Number(filters.maxPrice)) {
        return false;
      }
      return true;
    });

    const limit = Math.max(1, filters.limit || 9);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(Math.max(1, filters.page || 1), totalPages);
    const start = (currentPage - 1) * limit;

    return {
      data: filtered.slice(start, start + limit),
      pagination: {
        total,
        currentPage,
        limit,
        totalPages,
      },
    };
  },

  getProductById(id: EntityId): Product {
    const db = loadDb();
    const found = db.products.find((item) => String(item.id) === String(id));
    return found ?? db.products[0];
  },

  async createProduct(input: ProductInput, image: File | null): Promise<Product> {
    const db = loadDb();
    const category = db.categories.find((cat) => String(cat.id) === String(input.categoryId));
    const imageUrl = image
      ? await fileToDataUrl(image)
      : makePosterDataUri(input.name.slice(0, 14), input.platform || "GAME", "#c8f169", "#ff5b3a");

    const created: Product = {
      id: Date.now(),
      name: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
      stock: Number(input.stock),
      platform: (input.platform || "MULTI") as Product["platform"],
      imageUrl,
      categoryId: input.categoryId,
      category: category ? { id: category.id, name: category.name } : undefined,
    };
    db.products = [created, ...db.products];
    saveDb(db);
    return created;
  },

  async updateProduct(id: EntityId, input: ProductInput, image: File | null): Promise<Product> {
    const db = loadDb();
    const category = db.categories.find((cat) => String(cat.id) === String(input.categoryId));
    const newImageUrl = image ? await fileToDataUrl(image) : null;
    let updated = db.products[0];

    db.products = db.products.map((product) => {
      if (String(product.id) !== String(id)) return product;
      updated = {
        ...product,
        name: input.name.trim(),
        description: input.description.trim(),
        price: Number(input.price),
        stock: Number(input.stock),
        platform: (input.platform || product.platform) as Product["platform"],
        imageUrl: newImageUrl ?? product.imageUrl,
        categoryId: input.categoryId,
        category: category ? { id: category.id, name: category.name } : product.category,
      };
      return updated;
    });
    saveDb(db);
    return updated;
  },

  removeProduct(id: EntityId): void {
    const db = loadDb();
    db.products = db.products.filter((product) => String(product.id) !== String(id));
    saveDb(db);
  },

  listOrders(): Order[] {
    return loadDb().orders;
  },

  createOrder(input: CreateOrderInput, user: User | null): Order {
    const db = loadDb();
    const product = db.products.find((item) => String(item.id) === String(input.productId)) ?? db.products[0];
    const created: Order = {
      id: Math.floor(5000 + Math.random() * 4000),
      userId: user?.id ?? 2,
      productId: product.id,
      quantity: input.quantity,
      total: Number(product.price) * input.quantity,
      status: "PENDING",
      shippingAddress: input.shippingAddress,
      createdAt: new Date().toISOString(),
      user: user
        ? { id: user.id, name: user.name, email: user.email }
        : { id: 2, name: "Jugador Demo", email: "user@respawn.com" },
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        platform: product.platform,
      },
    };
    db.orders = [created, ...db.orders];
    saveDb(db);
    return created;
  },

  updateOrderStatus(id: EntityId, status: OrderStatus): Order {
    const db = loadDb();
    let updated = db.orders[0];
    db.orders = db.orders.map((order) => {
      if (String(order.id) === String(id)) {
        updated = { ...order, status };
        return updated;
      }
      return order;
    });
    saveDb(db);
    return updated;
  },

  removeOrder(id: EntityId): void {
    const db = loadDb();
    db.orders = db.orders.filter((order) => String(order.id) !== String(id));
    saveDb(db);
  },
};
