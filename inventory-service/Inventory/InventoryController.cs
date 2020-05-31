using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InventoryService.Inventory
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly ILogger<InventoryController> _logger;
        private readonly ProductStore _store;

        public InventoryController(ILogger<InventoryController> logger, ProductStore store)
        {
            _logger = logger;
            _store = store;
        }

        [HttpGet]
        public IEnumerable<Product> Get() => _store.GetProducts();

        [HttpGet("{id}")]
        public ActionResult<Product> Get(string id)
        {
            var product = _store.GetProduct(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost("inventory-change")]
        public ActionResult<bool> UpdateQuantity(InventoryChange update)
        {
            var current = _store.GetProduct(update.Id);

            if (current == null)
                return NotFound();

            _store.UpdateQuantity(current.Id, current.Quantity + update.ChangeAmount);

            return Ok(true);
        }
    }
}
