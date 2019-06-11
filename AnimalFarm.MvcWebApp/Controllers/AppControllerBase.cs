using AnimalFarm.Core;
using AnimalFarm.Shared;
using CSI.Web.Mvc;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Web.Mvc;

namespace AnimalFarm.MvcWebApp.Controllers
{
    public abstract class AppControllerBase : Controller
    {
        protected JsonResult InternalServerError(Exception error,string operation = "read")
        {
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return Json(new { message = ExceptionUtility.GetLastExceptionMessage(error), operation = operation }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult InternalServerError(string message)
        {
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return Json(new { message }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult InternalServerError(string format, params object[] args)
        {
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return Json(new { message = String.Format(format, args) }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult BadRequest(string message = "Invalid Request")
        {
            message = string.Concat(message, String.Join(",", ModelState.GetErrorMessges()));
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { message }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult Ok(string message = "success")
        {
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { message }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult OkFormat(string format, params object[] args)
        {
            return Ok(String.Format(format, args));
        }

        protected JsonResult NotFound(string message = "Data not found")
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            return Json(new { message }, JsonRequestBehavior.AllowGet);
        }

        protected JsonResult Created(string message = "created")
        {
            Response.StatusCode = (int)HttpStatusCode.Created;
            return Json(new { message }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult JsonNet(object data, JsonRequestBehavior behavior = JsonRequestBehavior.AllowGet)
        {
            return new JsonNetResult(data, new JsonSerializerSettings() {  ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        public ActionResult JsonNet(object data, JsonSerializerSettings settings, JsonRequestBehavior behavior = JsonRequestBehavior.AllowGet)
        {
            return new JsonNetResult(data, settings);
        }
    }
}