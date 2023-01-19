import Image from 'next/image'
import Link from "next/link";

export default function Nav() {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <Image src="/logo.png"
                           alt="logo"
                           width={36}
                           height={36}/>
                    Bigtable Emulator Frontend
                </Link>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" href="/">Home</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}