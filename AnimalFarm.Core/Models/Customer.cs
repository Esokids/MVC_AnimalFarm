
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


namespace AnimalFarm.Core.Models
{

using System;
    using System.Collections.Generic;
    
public partial class Customer
{

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
    public Customer()
    {

        this.Orders = new HashSet<Order>();

    }


    public string CustomerCode { get; set; }

    public string CustomerName { get; set; }

    public string Address1 { get; set; }

    public string Address2 { get; set; }

    public System.DateTime RegisterDate { get; set; }

    public System.DateTime CreateDateTime { get; set; }

    public System.DateTime UpdateDateTime { get; set; }

    public bool IsActive { get; set; }



    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<Order> Orders { get; set; }

}

}
