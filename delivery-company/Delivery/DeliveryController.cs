using Microsoft.AspNetCore.Mvc;

namespace DeliveryCompany
{
    [ApiController]
    [Route("[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly DeliveryStore _store;

        public DeliveryController(DeliveryStore store) => _store = store;

        [HttpGet]
        public ActionResult<Delivery> Get()
        {
            return Ok("Hello from Delivery Company");
        }

        [HttpGet("{deliveryId}")]
        public ActionResult<Delivery> GetDelivery(string deliveryId)
        {
            var delivery = _store.GetDelivery(deliveryId);

            if (delivery == null)
                return NotFound();

            return Ok(delivery);
        }

        [HttpPost]
        public IActionResult NewDelivery([FromBody]NewDelivery newDelivery)
        {
            var delivery = _store.CreateDelivery(newDelivery);

            return Created($"/delivery/{delivery.Id}", delivery);
        }

        [HttpPost("update-status")]
        public IActionResult UpdateState([FromBody]NewStatus updateStatus)
        {
            var delivery = _store.GetDelivery(updateStatus.Id);

            if (delivery == null)
            {
                return NotFound();
            }

            delivery.Events.Add(new DeliveryEvent(updateStatus.Status));

            _store.UpdateDelivery(delivery);

            return NoContent();
        }
    }
}
