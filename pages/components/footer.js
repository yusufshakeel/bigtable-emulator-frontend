import Link from "next/link";

export default function Footer() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col p-5 mt-5 text-center">
                    <p>Created by: <Link href="https://github.com/yusufshakeel">Yusuf Shakeel</Link></p>
                    <Link href="https://github.com/yusufshakeel/bigtable-emulator-frontend">GitHub</Link>
                </div>
            </div>
        </div>
    );
}