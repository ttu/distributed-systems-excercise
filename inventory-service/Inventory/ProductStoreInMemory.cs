using System;
using System.Collections.Generic;
using System.Linq;

namespace InventoryService.Inventory
{
    public class ProductStoreInMemory
    {
        private readonly List<Product> _database;

        public ProductStoreInMemory()
        {
            _database = new List<Product>
           {
               new Product { Id = "", Name = "", Price = 10, Quantity = 2 }
           };
        }

        public IEnumerable<Product> GetProducts() => _database.ToList();

        public Product? GetProduct(string id) => _database.FirstOrDefault(p => p.Id == id);

        public bool UpdateQuantity(string id, int quantity)
        {
            var product = GetProduct(id);

            if (product == null)
                return false;

            product.Quantity = quantity;
            return true;
        }
    }
}
