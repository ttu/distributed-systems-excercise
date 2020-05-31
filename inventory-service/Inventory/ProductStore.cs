using System;
using System.Collections.Generic;
using System.Linq;

namespace InventoryService.Inventory
{
    public class ProductStore
    {
        private readonly ProductContext _ctx;

        public ProductStore(ProductContext ctx)
        {
            _ctx = ctx;
        }

        public IEnumerable<Product> GetProducts() => _ctx.Products.ToList();

        public Product? GetProduct(string id) => _ctx.Products.FirstOrDefault(p => p.Id == id);

        public bool UpdateQuantity(string id, int quantity)
        {
            var product = GetProduct(id);

            if (product == null)
                return false;

            product.Quantity = quantity;
            _ctx.SaveChanges();

            return true;
        }
    }
}
