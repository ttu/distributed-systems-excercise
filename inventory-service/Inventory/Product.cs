using System;

namespace InventoryService.Inventory
{
    public class Product
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string ImageSrc { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }
    }

    public class InventoryChange
    {
        public string Id { get; set; }
        public int ChangeAmount { get; set; }
    }
}
