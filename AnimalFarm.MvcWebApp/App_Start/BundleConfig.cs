using System.Web;
using System.Web.Optimization;

namespace AnimalFarm.MvcWebApp
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                         "~/assets/lib/jquery/jquery.min.js",
                         "~/assets/lib/jquery-scrollTo/jquery.scrollTo.min.js",
                         "~/assets/lib/scrollup/jquery.scrollUp.min.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/assets/lib/twitter-bootstrap/js/bootstrap.min.js",
                      "~/assets/lib/bootstrap-notify/bootstrap-notify.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/kendo-ui").Include(
                     "~/assets/lib/kendo-ui/js/kendo.web.min.js",
                     "~/assets/lib/kendo-ui/js/kendo.aspnetmvc.min.js",
                     "~/assets/lib/kendo-ui/js/cultures/kendo.culture.en.min.js",
                     "~/assets/lib/kendo-ui/js/cultures/kendo.culture.en-US.min.js",
                     "~/assets/lib/kendo-ui/js/messages/kendo.culture.en-US.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                     "~/assets/js/app.ui.js"));

            bundles.Add(new StyleBundle("~/assets/lib/kendo-ui/styles").Include(
                     "~/assets/lib/kendo-ui/styles/kendo.bootstrap-v4.min.css"));

            bundles.Add(new StyleBundle("~/assets/lib/font-awesome/css").Include(
                     "~/assets/lib/font-awesome/css/all.min.css",
                     "~/assets/lib/font-awesome/css/fontawesome.css"));

            bundles.Add(new StyleBundle("~/assets/lib/twitter-bootstrap").Include(
                     "~/assets/lib/twitter-bootstrap/css/bootstrap.min.css"));

            bundles.Add(new StyleBundle("~/assets/app").Include(
                    "~/assets/lib/jquery-confirm/jquery-confirm.min.css",
                    "~/assets/lib/animate.css/animate.min.css",
                    "~/assets/css/site.css",
                    "~/assets/css/site-vendor.css"));

#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = false;
#endif
        }
    }
}
