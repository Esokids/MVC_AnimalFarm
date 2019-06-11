using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared
{
    public static class AssemblyExtensions
    {
        public static string GetProduct(this Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyProductAttribute>();
            return attr == null ? null : attr.Product;
        }

        public static string GetDescription(this Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyDescriptionAttribute>();
            if (attr == null) { return null; }
            return attr.Description;
        }

        public static string GetCopyright(this Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyCopyrightAttribute>();
            if (attr == null) { return null; }
            return attr.Copyright;
        }

        public static string GetCompany(this Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyCompanyAttribute>();
            if (attr == null) { return null; }
            return attr.Company;
        }

        public static Version GetVersion(this Assembly assembly)
        {
            return assembly.GetName().Version;
        }

        public static string GetFileVersion(this Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>();
            if (attr == null) { return null; }
            return attr.Version;
        }

        public static Type[] GetClassWithAssignableFromBaseType(this Assembly assembly, Type baseType)
        {
            List<Type> list = new List<Type>();
            foreach (Type type in assembly.GetTypes())
            {
                if ((baseType.IsAssignableFrom(type) && type.IsClass) && !type.IsAbstract)
                {
                    list.Add(type);
                }
            }
            return list.ToArray();
        }

        public static Type[] GetTypeFromAttribute<TAttr>(this Assembly assembly, bool inherit) where TAttr : Attribute
        {
            List<Type> list = new List<Type>();
            foreach (Type type in assembly.GetTypes())
            {
                if (type.IsDefined(typeof(TAttr), inherit))
                {
                    list.Add(type);
                }
            }
            return list.ToArray();
        }
    }

}
