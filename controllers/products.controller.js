import ProductDAO from "../daos/products.dao.js";
import UsersDAO from "../daos/users.dao.js";
import CartDAO from "../daos/carts.dao.js";
import UserDTO from "../dtos/user.dto.js";
import ProductDTO from "../dtos/product.dto.js";

const GetProducts = async (req, res) => {
    try {
        const products = await ProductDAO.getAll();
        const userId = req.session.user;
        const user = await UsersDAO.getUserByID(userId);
        const userDTO = new UserDTO(user);
        const productsDTO = products.map(product => new ProductDTO(product));
        res.render("products", { user:userDTO, products: productsDTO });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo productos");
      }
}

const GetProductById = async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await ProductDAO.getById(pid);
      const productDTO = new ProductDTO(product)
      res.render('detailProduct', { product: productDTO });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error obteniendo detalle del producto');
  }
}

const AddProductCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.session.user;
    await CartDAO.addProduct(userId, productId);
    res.redirect("/store/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error agregando producto al carrito");
  }
}

const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  
  // Convertir userId a número si es una cadena de caracteres
  const userId = req.session.user;

  try {
    const cart = await CartDAO.getByCartId(cid);
    console.log(cart.userId)
    console.log(userId)
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    const products = await Promise.all(cart.products.map(async (productId) => {
      const product = await ProductDAO.getById(productId);
      if (product.stock < 1) throw new Error(`Producto "${product.name}" sin stock disponible`);
      return product;
    }));

    // Llamar a finalizePurchase con userId convertido a número
    const ticket = await CartDAO.finalizePurchase(userId, cart, products);
    return res.status(200).json({ message: "Compra realizada con éxito", ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar la compra del carrito" });
  }
};

const viewCart = async (req, res) => {
  const userId = req.session.user;
  console.log(userId)
  try {
      const cart = await CartDAO.getByUserId(userId);
      console.log(cart)
      if (cart) {
          res.render('cart', { cart });
      } else {
          return res.status(404).json({ message: "El usuario no tiene un carrito asociado" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener el carrito del usuario" });
  }
};

export default  {
    GetProducts,
    GetProductById,
    AddProductCart,
    purchaseCart,
    viewCart
}