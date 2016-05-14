<?php
abstract class DB{
    
    // definisikan variabel untuk kelas ini saja
    PRIVATE STATIC $server      = "localhost";
    PRIVATE STATIC $panggilan   = "root";
    PRIVATE STATIC $sandi       = "";
    PRIVATE STATIC $pusatdata   = "aplikasi_islam";


    PROTECTED FUNCTION Buka(){
        
        // koneksikan database
        $j = mysqli_connect
        ( self::$server
        , self::$panggilan
        , self::$sandi
        , self::$pusatdata
        );
        $j->set_charset('utf8');
        // jika J berhasil, maka set $data = J (kunci akses ke database)
        IF($j)
            RETURN $j;
        // atau gagal, selesaikan program.
        ELSE
            DIE("Unable to connect");
        
        // hapus variabel J untuk
        UNSET($j);
    }
    
    PROTECTED FUNCTION Tutup(){
        mysqli_close(self::$db);
    }
    
}

abstract class SQL extends DB{
    
    // deret nama tabel
    const TABEL_JADWAL  = "jadwal_solat";
    const TABEL_TIPS    = "tips";
    
    // pengiriman data
    private static $data;


    /*
    * langsung terima query
    */
    PROTECTED FUNCTION Jalankan($SQL){
        try{
            $db  = self::Buka();
            $dbc = $db->query( $SQL );
            
            if(!$dbc){
                throw new Exception("Query gagal dipanggil :(");
            }else{
                return $dbc;
            }
        }catch(Exception $e){
            $e->Baca($db->error);
        }
    }

SELF::Jalankan("select * from " . . "WHERE ");
}

CLASS Jadwal_solat extends SQL{
    
    private $tanggal;
    
    /*
    * @param $param, jika diisi tanggal hari ini, maka tampilkan jadwal solat hari ini.
    */
    function __construct($param = null){
        
        if($param){
            $this->tanggal = str_replace(['\'','"'], [''], $param);
            $this->Perhari();
        }else{
            
        }
    }
    
    private function Perhari(){
        $j = SELF::Jalankan("SELECT imsak,subuh,zuhur,ashar,maghrib,isya from " . SELF::TABEL_JADWAL . " WHERE date = {$this->date}");
        self::$data = $j->fetch_assoc();
    }
    
    private function Semua(){
        
    }
    
    public function Baca(){
    /*
    * Implementasi :
    *
    * while($data = [objek]->Baca) :
    *    $data['namaKolom'];
    * endwhile;
    */
        return self::$data;
    }    
    
    
    
}



echo SQL::Jalankan();

?>