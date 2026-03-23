export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">About Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience the best food ordering with real-time tracking and customizable options.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Orders
                </a>
              </li>
              <li>
                <a href="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> info@restaurant.com
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="font-medium">Phone:</span> (555) 123-4567
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="font-medium">Address:</span> 123 Food Street
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Hours</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Mon - Fri: 9am - 10pm
              </li>
              <li className="text-sm text-muted-foreground">
                Saturday: 10am - 11pm
              </li>
              <li className="text-sm text-muted-foreground">
                Sunday: 10am - 9pm
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Restaurant Ordering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

